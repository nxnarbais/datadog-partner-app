# App to get started with Datadog

This app is based on the [quick start guide](https://spring.io/quickstart) for Spring boot and on the [building a restful web service](https://spring.io/guides/gs/actuator-service/).


To check if this works well go to [localhost:8080/hello?name=Datadog](http://localhost:8080/hello?name=Datadog) and [localhost:8080/greeting?name=dd-partner](http://localhost:8080/greeting?name=dd-partner).

## APM

To instrument your app with APM and Datadog, nothing more simple than to follow this [doc](https://docs.datadoghq.com/tracing/setup/java/).

1. Build the JAR file with `./gradlew build`
2. Download `dd-java-agent.jar` that contains the Agent class files

```
wget -O dd-java-agent.jar 'https://repository.sonatype.org/service/local/artifact/maven/redirect?r=central-proxy&g=com.datadoghq&a=dd-java-agent&v=LATEST'
```

3. Add the following JVM argument `-javaagent:/path/to/the/dd-java-agent.jar`

```
java -javaagent:./dd-java-agent.jar -jar build/libs/YOUR_FILE_NAME.jar
```

Example for the current project:

```
java -javaagent:./dd-java-agent.jar -jar build/libs/demo-0.0.1-SNAPSHOT.jar
```

And that's it since the framework that we use is [compatible](https://docs.datadoghq.com/tracing/setup/java/#compatibility) with auto-instrumentation.

## Datadog agent

To receive the trace inside your Datadog account, check for the instructions [here](https://app.datadoghq.com/account/settings#agent) or [here](https://app.datadoghq.eu/account/settings#agent) if you are in the Europe datacenter.

Otherwise, just copy and edit the `.env` file:

```
cp .env.example .env
vim .env
```

Then run docker-compose to launch the containerized agent:

```
docker-compose up
```

*As a side note, you can see that the dockerized agent is configured to receive non local APM traces*

Run your application a few more times and you should start to see some traces in your account.

## Enrich your trace with tags and attributes

You'll notice with this simple setup that the service is named `unnamed-java-app`. You can now check for [additional properties](https://docs.datadoghq.com/tracing/setup/java/#configuration) to set to get a cleaner and more actionable data.

For instance, here is the final command I run:
```
java -javaagent:./dd-java-agent.jar -Ddd.service=dd-partner-demo -Ddd.version=0.0.1 -Ddd.tags=partner.class:workshop,partner.app:javaspringboot-dummy,owner:ddog,customer:abc,team:team -jar build/libs/demo-0.0.1-SNAPSHOT.jar
```

All the tags added can be found in the trace attributes. Note that the tag `owner` is not overriding the tag `owner` set on the agent. The tag `env` is overriden but not the tag team.

## DogStatsD

You can also submit metrics from your application via DogStatsD, you can find some doc [here](https://docs.datadoghq.com/developers/dogstatsd/?tab=java). The dependency can be found the the maven [repository](https://mvnrepository.com/artifact/com.datadoghq/java-dogstatsd-client).

In this project, the dependency is already set in the `build.gradle` file. You just have to uncomment the various lines between `<DOGSTATSD>` in `src/main/java/com/example/demo/DemoApplication.java` and in `src/main/java/com/example/demo/Greeting.java`.

## Instrument a method

### Option 1: @Trace

In this project, the dependency is already set in the `build.gradle` file. You just have to uncomment the various lines between `<@TRACE>` in `src/main/java/com/example/demo/DemoApplication.java` and in `src/main/java/com/example/demo/Greeting.java`.

### Option 2: dd.trace.methods

<!-- FIXME: -->
Add the method of interest in your Java execution:
```
-Ddd.trace.methods=com.example.demo.GreetingController[method0]
```

## TODO

- Move app to JDK 11 to use profiling
- Fix option 2 in Instrument a method
