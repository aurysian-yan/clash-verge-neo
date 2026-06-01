//! macOS 主窗口原生标题栏适配。

use std::sync::atomic::{AtomicBool, Ordering};

use clash_verge_logging::{Type, logging};
use objc2::rc::Retained;
use objc2::{MainThreadMarker, MainThreadOnly, msg_send};
use objc2_app_kit::{
    NSSplitViewController, NSSplitViewItem, NSToolbar, NSView, NSViewController, NSWindow, NSWindowStyleMask,
    NSWindowTitleVisibility, NSWindowToolbarStyle,
};
use tauri::WebviewWindow;

const UNIFIED_TITLE_MIN_WIDTH: f64 = 760.0;

static SPLIT_VIEW_READY: AtomicBool = AtomicBool::new(false);
static UNIFIED_TITLE_ENABLED: AtomicBool = AtomicBool::new(false);

pub fn configure(window: &WebviewWindow) {
    let logical_width = match window.inner_size().and_then(|size| {
        window
            .scale_factor()
            .map(|scale_factor| size.width as f64 / scale_factor)
    }) {
        Ok(width) => width,
        Err(e) => {
            logging!(warn, Type::Window, "读取 macOS 主窗口宽度失败: {}", e);
            return;
        }
    };

    if let Err(e) = configure_native_window(window, logical_width >= UNIFIED_TITLE_MIN_WIDTH) {
        logging!(warn, Type::Window, "配置 macOS 主窗口样式失败: {}", e);
    }
}

pub fn reset() {
    SPLIT_VIEW_READY.store(false, Ordering::Release);
    UNIFIED_TITLE_ENABLED.store(false, Ordering::Release);
}

fn configure_native_window(window: &WebviewWindow, use_unified_title: bool) -> Result<(), String> {
    let Some(mtm) = MainThreadMarker::new() else {
        return Err("macOS 窗口样式必须在主线程配置".into());
    };

    let ns_window = ns_window(window)?;

    if !SPLIT_VIEW_READY.load(Ordering::Acquire) {
        mount_split_view_controller(window, mtm)?;
        SPLIT_VIEW_READY.store(true, Ordering::Release);
    }

    if use_unified_title {
        enable_unified_title(ns_window, mtm);
    } else {
        restore_system_title(ns_window);
    }

    Ok(())
}

fn mount_split_view_controller(window: &WebviewWindow, mtm: MainThreadMarker) -> Result<(), String> {
    let ns_window = ns_window(window)?;
    let webview = ns_view(window)?;

    let content_controller: Retained<NSViewController> = unsafe { msg_send![mtm.alloc::<NSViewController>(), init] };
    content_controller.setView(webview);

    let split_controller: Retained<NSSplitViewController> =
        unsafe { msg_send![mtm.alloc::<NSSplitViewController>(), init] };
    let detail_item = NSSplitViewItem::splitViewItemWithViewController(&content_controller);
    detail_item.setCanCollapse(false);
    split_controller.addSplitViewItem(&detail_item);

    ns_window.setContentViewController(Some(&split_controller));
    Ok(())
}

fn enable_unified_title(ns_window: &NSWindow, mtm: MainThreadMarker) {
    if UNIFIED_TITLE_ENABLED.swap(true, Ordering::AcqRel) {
        return;
    }

    let mut style_mask = ns_window.styleMask();
    style_mask.insert(NSWindowStyleMask::FullSizeContentView);
    ns_window.setStyleMask(style_mask);

    let toolbar = NSToolbar::init(NSToolbar::alloc(mtm));
    toolbar.setVisible(true);

    ns_window.setToolbar(Some(&toolbar));
    ns_window.setToolbarStyle(NSWindowToolbarStyle::Unified);
    ns_window.setTitleVisibility(NSWindowTitleVisibility::Hidden);
    ns_window.setTitlebarAppearsTransparent(true);
}

fn restore_system_title(ns_window: &NSWindow) {
    UNIFIED_TITLE_ENABLED.store(false, Ordering::Release);

    let mut style_mask = ns_window.styleMask();
    style_mask.remove(NSWindowStyleMask::FullSizeContentView);
    ns_window.setStyleMask(style_mask);

    ns_window.setToolbar(None);
    ns_window.setToolbarStyle(NSWindowToolbarStyle::Automatic);
    ns_window.setTitleVisibility(NSWindowTitleVisibility::Visible);
    ns_window.setTitlebarAppearsTransparent(false);
}

fn ns_window(window: &WebviewWindow) -> Result<&NSWindow, String> {
    let raw = window.ns_window().map_err(|e| e.to_string())?;
    unsafe { raw.cast::<NSWindow>().as_ref() }.ok_or_else(|| "无法获取 NSWindow".into())
}

fn ns_view(window: &WebviewWindow) -> Result<&NSView, String> {
    let raw = window.ns_view().map_err(|e| e.to_string())?;
    unsafe { raw.cast::<NSView>().as_ref() }.ok_or_else(|| "无法获取 WebView NSView".into())
}
