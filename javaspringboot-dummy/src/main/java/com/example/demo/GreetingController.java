package com.example.demo;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// import com.timgroup.statsd.NonBlockingStatsDClientBuilder;
// import com.timgroup.statsd.StatsDClient;

@RestController
public class GreetingController {

	private static final String template = "Hello, %s!";
	private final AtomicLong counter = new AtomicLong();

	@GetMapping("/greeting")
	public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
		// StatsDClient Statsd = new NonBlockingStatsDClientBuilder()
		// 			.prefix("statsd")
		// 			.hostname("localhost")
		// 			.port(8125)
		// 			.build();
		// String nameTag = "name:" + name;
		// Statsd.increment("page.views", 1, new String[]{"endpoint:greeting", nameTag});
		return new Greeting(counter.incrementAndGet(), String.format(template, name));
	}
}