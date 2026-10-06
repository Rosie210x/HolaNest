package com.sba301.he190020.spring.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sba301.he190020.spring.dto.CustomerCreateRequest;
import com.sba301.he190020.spring.service.CustomerService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser 
class CustomerControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CustomerService customerService;

    @Test
    @DisplayName("IT-BVA 1: Name length = 100 (Max Boundary) -> 200 OK")
    void createCustomer_NameLength100_Returns200() throws Exception {
        String validName = "A".repeat(100);
        CustomerCreateRequest request = new CustomerCreateRequest(
                null, validName, "test@gmail.com", "Hanoi", "0901234567", BigDecimal.valueOf(100)
        );

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("IT-BVA 2: Name length = 101 (Above Max Boundary) -> 400 Bad Request")
    void createCustomer_NameLength101_Returns400() throws Exception {
        String invalidName = "A".repeat(101);
        CustomerCreateRequest request = new CustomerCreateRequest(
                null, invalidName, "test@gmail.com", "Hanoi", "0901234567", BigDecimal.valueOf(100)
        );

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @ParameterizedTest
    @ValueSource(ints = {14, 15})
    @DisplayName("IT-BVA 3: Mobile length = 14, 15 (Valid Boundaries) -> 200 OK")
    void createCustomer_MobileLengthValidBoundaries_Returns200(int length) throws Exception {
        String validMobile = "0".repeat(length);
        CustomerCreateRequest request = new CustomerCreateRequest(
                null, "Nguyen Van A", "test@gmail.com", "Hanoi", validMobile, BigDecimal.valueOf(100)
        );

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("IT-BVA 4: Mobile length = 16 (Above Max Boundary) -> 400 Bad Request")
    void createCustomer_MobileLength16_Returns400() throws Exception {
        String invalidMobile = "0".repeat(16);
        CustomerCreateRequest request = new CustomerCreateRequest(
                null, "Nguyen Van A", "test@gmail.com", "Hanoi", invalidMobile, BigDecimal.valueOf(100)
        );

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("IT-BVA 5: Revenue = 0.0 (Min Boundary) -> 200 OK")
    void createCustomer_RevenueZero_Returns200() throws Exception {
        CustomerCreateRequest request = new CustomerCreateRequest(
                null, "Nguyen Van A", "test@gmail.com", "Hanoi", "0901234567", BigDecimal.ZERO
        );

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("IT-BVA 6: Revenue = -0.01 (Below Min Boundary) -> 400 Bad Request")
    void createCustomer_RevenueNegative_Returns400() throws Exception {
        CustomerCreateRequest request = new CustomerCreateRequest(
                null, "Nguyen Van A", "test@gmail.com", "Hanoi", "0901234567", BigDecimal.valueOf(-0.01)
        );

        mockMvc.perform(post("/api/v1/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}