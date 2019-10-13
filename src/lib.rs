#[macro_use]
extern crate seed;

use futures::Future;
use seed::prelude::*;
use seed::{Method, Request};
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsCast;

#[wasm_bindgen]
extern "C" {
    type GMap;
    type GMarker;
    //    fn initMap2(lati: f64, longi: f64);
    fn initMap() -> GMap;
    fn setMarker(map: &GMap, lati: f64, longi: f64, label: String) -> GMarker;
    fn removeMarker(marker: GMarker);
    fn setMapCenter(map: &GMap, lati: f64, longi: f64);
    fn setMapZoom(map: &GMap, zoom: f64);
//    type MyClass;
//
//    #[wasm_bindgen(constructor)]
//    fn new() -> MyClass;
//
//    #[wasm_bindgen(method, getter)]
//    fn number(this: &MyClass) -> u32;
//    #[wasm_bindgen(method, setter)]
//    fn set_number(this: &MyClass, number: u32) -> MyClass;
//    #[wasm_bindgen(method)]
//    fn render(this: &MyClass) -> String;
}

// Model

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CurrentPos {
    pub lati: f64,
    pub longi: f64,
    pub name: String,
}

struct Model {
    pub name: Option<String>,
    pub curr_pos: Option<CurrentPos>,
    pub other_pos: Vec<CurrentPos>,
    pub markers: Vec<GMarker>,
    pub map: GMap,
    pub err_msg: Option<String>
}

impl Model {
    pub fn update_map(&mut self) {
        while let Some(marker) = self.markers.pop() {
            removeMarker(marker);
            log!("Removed marker");
        }
        for pos in self.other_pos.clone() {
            let new_marker = setMarker(&self.map, pos.lati, pos.longi, pos.name.into());
            self.markers.push(new_marker);
        }
    }
}
// Update

#[derive(Clone)]
enum Msg {
    StartGeoTracking,
    NewPos(web_sys::Position),
    PosErr(web_sys::PositionError),
    DataFetched(seed::fetch::ResponseDataResult<Vec<CurrentPos>>),
    NewName(String),
}

fn update(msg: Msg, model: &mut Model, orders: &mut impl Orders<Msg>) {
    match msg {
        Msg::StartGeoTracking => {
            let (app_1, msg_mapper_1) = (orders.clone_app(), orders.msg_mapper());
            let (app_2, msg_mapper_2) = (orders.clone_app(), orders.msg_mapper());
            let cb = Closure::new(Box::new(move |pos: web_sys::Position| {
                app_1.update(msg_mapper_1(Msg::NewPos(pos)));
            }));

            let err_cb = Closure::new(Box::new(move |pos_err: web_sys::PositionError| {
                app_2.update(msg_mapper_2(Msg::PosErr(pos_err)));
            }));
            let cb_as_js = cb.as_ref().unchecked_ref();
            let cb_as_js_err = err_cb.as_ref().unchecked_ref();
            let geolocation = web_sys::window()
                .unwrap()
                .navigator()
                .geolocation()
                .unwrap();
            geolocation.watch_position_with_error_callback(&cb_as_js, Some(&cb_as_js_err)).unwrap();
            cb.forget();
            err_cb.forget();
        }
        Msg::NewPos(pos) => {
            if let Some(name) = model.name.clone() {
                let model_pos_was_empty = model.curr_pos.is_none();
                let new_pos = CurrentPos {
                    lati: pos.coords().latitude(),
                    longi: pos.coords().longitude(),
                    name,
                };
                model.curr_pos = Some(new_pos.clone());

                if model_pos_was_empty {
                    setMapCenter(&model.map, new_pos.lati, new_pos.longi);
                    setMapZoom(&model.map, 18.0);
                    // start sending and getting positions
                    orders.perform_cmd(get_other_people_position(new_pos.clone()));
                }
            }
        }
        Msg::DataFetched(resp) => match resp {
            Ok(res) => {
                log!("Got", res);
                let my_position = model.curr_pos.clone().unwrap();
                let futur = gloo::timers::future::TimeoutFuture::new(1_000)
                    .then(|_| get_other_people_position(my_position));
                model.other_pos = res;
                orders.perform_cmd(futur);
                model.update_map();
            }
            Err(err) => {
                log!("Got", err);
            }
        },
        Msg::NewName(name) => {
            log!("Name: ", name);
            model.name = Some(name.clone());
            if  let Some(cur_pos) = &mut model.curr_pos{
                cur_pos.name = name;
            }
        },
        Msg::PosErr(err) => {
            let code = err.message();
            model.err_msg = Some(code);
        }
    }
}

// View

fn view(model: &Model) -> impl View<Msg> {
    let err_2 = match &model.err_msg{
        None => {
            seed::empty()
        },
        Some(err) => {
            h1![class!["text-center"], err.clone()]
        },
    };
    div![
        class!["container"],
        div![
            class!["container"],
            div![div![
                class!["form-group"],
                {err_2},
                h1![class!["text-center"], "Nome?"],
                input![
                    id!("NameInput"),
                    class!["form-control"],
                    attrs! {At::Type => "text", At::Placeholder => "Boga"},
                    input_ev(Ev::Input, Msg::NewName)
                ]
            ],]
        ],
        nav![
            class![
                "navbar",
                "fixed-bottom",
                "navbar-light",
                "bg-light",
                "justify-content-around"
            ],
            button![
                class!["btn", "btn-outline-success"],
                attrs! {At::Type => "button"},
                " Perfil "
            ],
            button![
                class![
                    "btn",
                    "btn-lg",
                    "btn-outline-success",
                    "rounded-circle",
                    "text-center",
                    "shadow-lg"
                ],
                attrs! {At::Style => "margin-top: -20px; width:4em; height:4em; padding-left:0; padding-right:0; background-color: #28a745; color: white; border-color: #27a343; border-width:2px", At::Type => "button"},
                " Nearby "
            ],
            svg![
                class!["fav"],
                attrs! {"xmlns" => "http://www.w3.org/2000/svg", "width" => "40px", "height" => "40px", "viewBox" => "0 0 12 16"},
                path![
                    attrs! {"fill" => "white", "stroke-width" => "0.5", "stroke" => "#28a745", "fillRule" => "evenodd", "d" => "M9 2c-.97 0-1.69.42-2.2 1-.51.58-.78.92-.8 1-.02-.08-.28-.42-.8-1-.52-.58-1.17-1-2.2-1-1.632.086-2.954 1.333-3 3 0 .52.09 1.52.67 2.67C1.25 8.82 3.01 10.61 6 13c2.98-2.39 4.77-4.17 5.34-5.33C11.91 6.51 12 5.5 12 5c-.047-1.69-1.342-2.913-3-3z"}
                ]
            ]
        ]
    ]
}

fn get_other_people_position(pos: CurrentPos) -> impl Future<Item = Msg, Error = Msg> {
    let url = "https://the-beta.site/my_position";
    Request::new(url)
        .method(Method::Post)
        .body_json(&pos)
        .fetch_json_data(Msg::DataFetched)
}

fn init(_: Url, orders: &mut impl Orders<Msg>) -> Init<Model> {
    orders.send_msg(Msg::StartGeoTracking);
    let map = initMap();
    Init::new(Model {
        name: None,
        curr_pos: None,
        other_pos: vec![],
        markers: vec![],
        map,
        err_msg: None
    })
}

#[wasm_bindgen(start)]
pub fn render() {
    log!("Seed started.");
    seed::App::build(init, update, view).finish().run();
}
