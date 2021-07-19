#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
  let open = CustomMenuItem::new("open".to_string(), "Open").accelerator("CmdOrControl+O");
  let submenu = Submenu::new("File", Menu::new().add_item(open));
  let menu = Menu::new()
    .add_native_item(MenuItem::CloseWindow)
    .add_submenu(submenu);
  tauri::Builder::default()
    .menu(menu)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
