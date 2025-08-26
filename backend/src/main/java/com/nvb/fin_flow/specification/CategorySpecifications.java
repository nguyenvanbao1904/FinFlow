package com.nvb.fin_flow.specification;

import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.entity.User;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class CategorySpecifications {
    public static Specification<Category> nameContains(String kw) {
        return (root, query, cb) -> kw == null || kw.isEmpty() ? null :
                cb.like(cb.lower(root.get("name")), "%" + kw.toLowerCase() + "%");
    }

    public static Specification<Category> typeContains(String type) {
        return (root, query, cb) -> type == null || type.isEmpty() ? null :
                cb.equal(cb.lower(root.get("type")), type);
    }

    public static Specification<Category> belongToUser(String username) {
        return (root, query, cb) ->{
            if(username == null || username.isEmpty()) {
                return null;
            }
            Join<Category, User> userJoin = root.join("user");
            return cb.or(cb.equal(userJoin.get("username"), username), cb.equal(userJoin.get("username"), "admin"));
        };
    }
}
