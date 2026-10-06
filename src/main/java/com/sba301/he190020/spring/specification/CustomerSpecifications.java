package com.sba301.he190020.spring.specification;

import org.springframework.data.jpa.domain.Specification;

import com.sba301.he190020.spring.entity.Customer;

public final class CustomerSpecifications {

    private CustomerSpecifications() {
    }

    public static Specification<Customer> nameContains(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) {
                return cb.conjunction();
            }
            String pattern = "%" + name.trim().toLowerCase() + "%";
            return cb.like(cb.lower(root.get("name")), pattern);
        };
    }

    public static Specification<Customer> emailContains(String email) {
        return (root, query, cb) -> {
            if (email == null || email.isBlank()) {
                return cb.conjunction();
            }
            String pattern = "%" + email.trim().toLowerCase() + "%";
            return cb.like(cb.lower(root.get("email")), pattern);
        };
    }
}