# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw
COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN mkdir -p /data/uploads \
  && addgroup -S spring \
  && adduser -S spring -G spring
COPY --from=build /app/target/leather-api-0.0.1-SNAPSHOT.jar app.jar
ENV FILE_STORAGE_PATH=/data/uploads \
    SERVER_PORT=8080
VOLUME ["/data/uploads"]
USER spring
EXPOSE 8080
# Railway injects PORT; application.yml maps PORT -> server.port
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
