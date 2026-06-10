package com.example.wsdemo.config;

import java.io.File;
import java.nio.file.Path;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSquareServletConfig {

    @Bean
    @ConditionalOnClass(name = "websquare.http.DefaultRequestDispatcher")
    public ServletRegistrationBean<?> websquareDispatcher() {
        try {
            Class<?> servletClass = Class.forName("websquare.http.DefaultRequestDispatcher");
            Object servlet = servletClass.getDeclaredConstructor().newInstance();

            ServletRegistrationBean<?> registration = new ServletRegistrationBean<>(servlet);
            registration.addUrlMappings("*.wq");
            registration.addInitParameter("WEBSQUARE_HOME", resolveWebSquareHome());
            registration.setLoadOnStartup(1);
            return registration;
        } catch (ReflectiveOperationException ex) {
            throw new IllegalStateException("WebSquare engine class found but could not be instantiated", ex);
        }
    }

    private String resolveWebSquareHome() {
        Path home = Path.of("websquare_home").toAbsolutePath().normalize();
        return home.toString() + File.separator;
    }
}
