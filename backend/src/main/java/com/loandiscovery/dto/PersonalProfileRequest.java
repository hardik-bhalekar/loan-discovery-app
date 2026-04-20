package com.loandiscovery.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PersonalProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name can be at most 120 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 160, message = "Email can be at most 160 characters")
    private String email;

    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Phone must be a 10-digit number")
    private String phone;

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 80, message = "Age must be less than or equal to 80")
    private Integer age;

    @Size(max = 20, message = "Gender can be at most 20 characters")
    private String gender;

    @Size(max = 120, message = "City can be at most 120 characters")
    private String city;

    @Size(max = 120, message = "Occupation can be at most 120 characters")
    private String occupation;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }
}
