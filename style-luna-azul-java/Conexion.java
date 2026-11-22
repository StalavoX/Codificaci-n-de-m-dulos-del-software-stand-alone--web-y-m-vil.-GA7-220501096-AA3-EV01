import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {

    private static final String URL = System.getenv().getOrDefault(
            "DB_URL",
            "jdbc:mysql://localhost:3306/style_luna_azul"
    );
    private static final String USUARIO = System.getenv().getOrDefault(
            "DB_USER",
            "luna_app"
    );

    public static Connection conectar() {
        try {
            String contrasena = System.getenv("DB_PASSWORD");
            if (contrasena == null || contrasena.isBlank()) {
                throw new SQLException("Configure la variable de entorno DB_PASSWORD.");
            }
            return DriverManager.getConnection(URL, USUARIO, contrasena);
        } catch (SQLException e) {
            System.err.println("Error de conexión: " + e.getMessage());
            return null;
        }
    }
}