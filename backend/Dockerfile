# ---------- 1. Build Stage ----------
FROM maven:3.9.4-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ---------- 2. Run Stage ----------
FROM eclipse-temurin:21-jdk
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
