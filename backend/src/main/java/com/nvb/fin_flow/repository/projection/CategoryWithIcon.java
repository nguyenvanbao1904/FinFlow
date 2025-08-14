package com.nvb.fin_flow.repository.projection;

public interface CategoryWithIcon {
    String getId();
    String getName();
    String getColorCode();
    String getType();
    IconInfo getIcon();

    interface IconInfo{
        String getId();
        String getName();
        String getIconClass();
    }
}
