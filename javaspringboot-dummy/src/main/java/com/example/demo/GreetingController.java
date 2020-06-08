package com.example.demo;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.javanet.NetHttpTransport;

// DogStatsD
import com.timgroup.statsd.NonBlockingStatsDClientBuilder;
import com.timgroup.statsd.StatsDClient;

// Tracing
import datadog.trace.api.Trace;

import java.io.IOException;

@RestController
public class GreetingController {

	private static final String template = "Hello, %s!";
	private final AtomicLong counter = new AtomicLong();

	@GetMapping("/greeting")
	public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) throws InterruptedException, IOException {
		// <DOGSTATSD>
		// StatsDClient Statsd = new NonBlockingStatsDClientBuilder()
		// 			.prefix("statsd")
		// 			.hostname("localhost")
		// 			.port(8125)
		// 			.build();
		// String nameTag = "name:" + name;
		// Statsd.increment("page.views", 1, new String[]{"endpoint:greeting", nameTag});
		// <DOGSTATSD>

		method0();
		return new Greeting(counter.incrementAndGet(), String.format(template, name));
	}

	public static void method0() throws InterruptedException, IOException {
		Thread.sleep(350);
		method1();
		callWeb1();
		Thread.sleep(200);
		callWeb2();
	}

	public static void method1() throws InterruptedException {
		Thread.sleep(250);
	}

	public static void callWeb1() throws IOException {
		HttpRequestFactory requestFactory = new NetHttpTransport().createRequestFactory();
		HttpRequest request = requestFactory.buildGetRequest(new GenericUrl("https://github.com"));
		request.execute().parseAsString();
	}

	public static void callWeb2() throws IOException {
		HttpRequestFactory requestFactory = new NetHttpTransport().createRequestFactory();
		HttpRequest request = requestFactory.buildGetRequest(new GenericUrl("https://www.google.com"));
		request.execute().parseAsString();
	}

	// <@TRACE>
	// @Trace
	// public static void method2() throws InterruptedException {
	// 	Thread.sleep(150);
	// }
	// <@TRACE>
}