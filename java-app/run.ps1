$ideaMvn = "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\plugins\maven-plugin\lib\maven3\bin\mvn.cmd"
$ideaJdk = "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.3\jbr"

if (Get-Command mvn -ErrorAction SilentlyContinue) {
    mvn spring-boot:run
} elseif (Test-Path $ideaMvn) {
    $env:JAVA_HOME = $ideaJdk
    Write-Host "Using IntelliJ bundled Maven and JDK..." -ForegroundColor Cyan
    & $ideaMvn spring-boot:run
} else {
    Write-Host "Maven not found. Please install Maven or open the project in IntelliJ IDEA." -ForegroundColor Red
}
