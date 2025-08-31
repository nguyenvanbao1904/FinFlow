package com.nvb.fin_flow.specification;

import com.nvb.fin_flow.entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecifications {
    public static Specification<User> usernameContains(String kw) {
        return (root, query, cb) -> kw == null || kw.isEmpty() ? null:
                cb.like(root.get("username"),"%" +kw.toLowerCase() + "%");
    }

    public static Specification<User> roleContains(String kw) {
        return (root, query, cb) -> {
            if (kw == null || kw.isEmpty() || "all".equalsIgnoreCase(kw)) {
                return null;
            }
            return cb.like(cb.lower(root.join("roles").get("name")), "%" + kw.toLowerCase() + "%");
        };
    }
}
