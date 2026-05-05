# ============================================================
# Stage 1: Build with Maven
# ============================================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache Maven dependencies layer (faster rebuilds)
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# Extract layered JAR for better caching
RUN java -Djarmode=layertools -jar target/*.jar extract

# ============================================================
# Stage 2: Runtime (smaller image)
# ============================================================
FROM eclipse-temurin:21-jre-alpine AS runtime

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user (security best practice)
RUN addgroup -S taskflow && adduser -S taskflow -G taskflow

WORKDIR /app

# Copy layered jar files (in optimal order for caching)
COPY --from=builder --chown=taskflow:taskflow /build/dependencies/ ./
COPY --from=builder --chown=taskflow:taskflow /build/spring-boot-loader/ ./
COPY --from=builder --chown=taskflow:taskflow /build/snapshot-dependencies/ ./
COPY --from=builder --chown=taskflow:taskflow /build/application/ ./

USER taskflow

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# JVM tuning for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]
