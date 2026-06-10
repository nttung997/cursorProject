WebSquare Engine JAR (required for *.wq / XML page rendering)

Copy your licensed WebSquare 5 engine JAR from your WebSquare Studio or
distribution package into this folder. Example filename pattern:
  websquare_5.0_*.jar

Without this JAR:
  - Spring Boot REST API still runs (/api/employees)
  - Open preview/index.html in a browser for a UI demo
  - XML pages under WebContent/ui/ need the engine to render

Servlet version note:
  - Spring Boot 3.x uses Jakarta Servlet 6 (jakarta.servlet.*)
  - Use a WebSquare engine build that supports Jakarta if registering the servlet
