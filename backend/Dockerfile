# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw
COPY src src
RUN ./mvnw -q -DskipTests package \
  && mv target/leather-api-*.jar target/app.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN mkdir -p /tmp/uploads \
  && addgroup -S spring \
  && adduser -S spring -G spring \
  && chown -R spring:spring /tmp/uploads
COPY --from=build /app/target/app.jar app.jar
ENV FILE_STORAGE_PATH=/tmp/uploads \
    JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -Xms128m"
USER spring
EXPOSE 8080
# Render sets PORT; application.yml maps PORT -> server.port
ENTRYPOINT ["java", "-jar", "app.jar"]
