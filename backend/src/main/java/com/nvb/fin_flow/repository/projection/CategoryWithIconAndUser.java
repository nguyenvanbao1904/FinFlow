package com.nvb.fin_flow.repository.projection;

public interface CategoryWithIconAndUser {
    String getId();
    String getName();
    String getColorCode();
    String getType();
    IconInfo getIcon();
    String getUser_Username();

    interface IconInfo{
        String getId();
        String getName();
        String getIconClass();
    }
}
