package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// DogStatS
import com.timgroup.statsd.NonBlockingStatsDClientBuilder;
import com.timgroup.statsd.StatsDClient;

@SpringBootApplication
@RestController
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@GetMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		// <DOGSTATSD>
		// StatsDClient Statsd = new NonBlockingStatsDClientBuilder()
		// 			.prefix("statsd")
		// 			.hostname("localhost")
		// 			.port(8125)
		// 			.build();
		// String nameTag = "name:" + name;
		// Statsd.increment("page.views", 1, new String[]{"endpoint:hello", nameTag});
		// <DOGSTATSD>

		return String.format("Hello %s!", name);
	}

}
