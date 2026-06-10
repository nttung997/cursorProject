package com.example.wsdemo.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.wsdemo.model.Employee;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    @GetMapping("/employees")
    public List<Employee> listEmployees() {
        return List.of(
                new Employee("E001", "Kim Minsoo", "Engineering", "minsoo.kim@example.com"),
                new Employee("E002", "Lee Jiyeon", "Design", "jiyeon.lee@example.com"),
                new Employee("E003", "Park Junho", "Sales", "junho.park@example.com"),
                new Employee("E004", "Choi Sora", "HR", "sora.choi@example.com"));
    }
}
