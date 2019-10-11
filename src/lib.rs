#[macro_use]
extern crate seed;
use seed::prelude::*;


use wasm_bindgen::prelude::*;

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

struct Model {
    pub curr_lat: Option<f64>,
    pub curr_longi: Option<f64>,
    pub markers: Vec<GMarker>,
    pub map: GMap,
}

use wasm_bindgen::JsCast;
use seed::document;


// Update



#[derive(Clone)]
enum Msg {
    StartGeoTracking,
    NewPos(web_sys::Position)
}

fn update(msg: Msg, model: &mut Model, orders: &mut impl Orders<Msg>) {
    match msg {
        Msg::StartGeoTracking => {
            let (app, msg_mapper) = (orders.clone_app(), orders.msg_mapper());
            let cb = Closure::new(Box::new(move |pos: web_sys::Position| {
                app.update(msg_mapper(Msg::NewPos(pos)));
            }));
            let cb_as_js = cb.as_ref().unchecked_ref();
            let geolocation = web_sys::window().unwrap().navigator().geolocation().unwrap();
            geolocation.watch_position(&cb_as_js).unwrap();
            cb.forget();
        }
        Msg::NewPos(pos) => {
            model.curr_lat = Some(pos.coords().latitude());
            model.curr_longi = Some(pos.coords().longitude());
            log!("Lat {}", model.curr_lat);
            log!("Longitude {}", model.curr_longi);
            while let Some(marker) = model.markers.pop(){
                removeMarker(marker);
                log!("Removed marker");
            }
            let marker = setMarker(&model.map, model.curr_lat.unwrap(), model.curr_longi.unwrap(), "Test".into());
            model.markers.push(marker);
            setMapCenter(&model.map, model.curr_lat.unwrap(), model.curr_longi.unwrap());
            setMapZoom(&model.map, 15.0);
        }
    }
}

// View

fn view(model: &Model) -> impl View<Msg> {
    div![
        class!["container"],
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
} //fill="white" stroke-width="0.5" stroke="#28a745"  fill-rule="evenodd"
fn init(_: Url, orders: &mut impl Orders<Msg>) -> Init<Model> {
    orders
        .send_msg(Msg::StartGeoTracking);
    let map = initMap();
    Init::new(Model{
        curr_lat: None,
        curr_longi: None,
        markers: vec![],
        map
    })

}

#[wasm_bindgen(start)]
pub fn render() {
    let el = web_sys::window().unwrap().document().unwrap().get_element_by_id("app").unwrap();
    log!(el);
    seed::App::build(init, update, view)
        .finish()
        .run();
}
