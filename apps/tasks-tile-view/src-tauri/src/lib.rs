#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                use tauri::Manager;
                use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};
                let window = app
                    .get_webview_window("main")
                    .expect("main window not found");
                println!("[vibrancy] applying NSVisualEffectMaterial::HudWindow");
                // HudWindow gives a noticeably dark frosted look on Sonoma/
                // Sequoia. Active state keeps the blur on regardless of focus.
                match apply_vibrancy(
                    &window,
                    NSVisualEffectMaterial::HudWindow,
                    Some(NSVisualEffectState::Active),
                    Some(12.0),
                ) {
                    Ok(_) => println!("[vibrancy] apply_vibrancy OK"),
                    Err(e) => eprintln!("[vibrancy] apply_vibrancy FAILED: {:?}", e),
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
