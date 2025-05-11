# ---------- 1. Build Stage ----------
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ---------- 2. Run Stage ----------
FROM openjdk:17-jdk-slim
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
