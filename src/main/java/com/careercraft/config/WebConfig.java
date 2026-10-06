package com.careercraft.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Maps clean URL paths to their static HTML pages so Spring Boot
 * serves them without the .html extension.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/try").setViewName("forward:/try.html");
        registry.addViewController("/how-it-works").setViewName("forward:/how-it-works.html");
        registry.addViewController("/signup").setViewName("forward:/signup.html");
        registry.addViewController("/login").setViewName("forward:/login.html");
        registry.addViewController("/history").setViewName("forward:/history.html");
        registry.addViewController("/about").setViewName("forward:/about.html");
    }
}
