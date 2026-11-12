// Re;Guide desktop shell. The app is one web page (dist/index.html); Rust only gives it
// plain file access inside folders the user picks. Nothing is sent anywhere.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::{fs, path::PathBuf};

fn err<E: std::fmt::Display>(e: E) -> String { e.to_string() }

#[tauri::command]
fn read_text(path: PathBuf) -> Result<String, String> { fs::read_to_string(path).map_err(err) }

#[tauri::command]
fn write_text(path: PathBuf, text: String) -> Result<(), String> {
    if let Some(p) = path.parent() { fs::create_dir_all(p).map_err(err)?; }
    // write to a temp file then rename, so a crash mid-save never leaves a half-written project
    let tmp = path.with_extension("tmp-save");
    fs::write(&tmp, text).map_err(err)?;
    fs::rename(&tmp, &path).map_err(err)
}

#[tauri::command]
fn list_dir(path: PathBuf) -> Result<Vec<(String, bool)>, String> {
    let mut out = vec![];
    for e in fs::read_dir(path).map_err(err)? {
        let e = e.map_err(err)?;
        out.push((e.file_name().to_string_lossy().into(), e.path().is_dir()));
    }
    Ok(out)
}

#[tauri::command]
fn make_dir(path: PathBuf) -> Result<(), String> { fs::create_dir_all(path).map_err(err) }

#[tauri::command]
fn exists(path: PathBuf) -> bool { path.exists() }


fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![read_text, write_text, list_dir, make_dir, exists])
        .run(tauri::generate_context!())
        .expect("error while running Re;Guide");
}

