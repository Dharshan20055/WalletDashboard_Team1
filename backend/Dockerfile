FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY target/wallet_dashboard-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-jar","app.jar"]