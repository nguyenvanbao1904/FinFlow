package com.nvb.fin_flow.repository.projection;

public interface CategoryWithIconAndCreatedBy {
    String getId();
    String getName();
    String getColorCode();
    String getType();
    IconInfo getIcon();
    String getCreatedByUsername();

    interface IconInfo{
        String getId();
        String getName();
        String getIconClass();
    }
}
