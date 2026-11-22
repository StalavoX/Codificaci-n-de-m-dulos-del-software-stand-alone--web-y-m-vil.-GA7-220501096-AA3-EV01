import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ClienteDAO {

    public boolean insertarCliente(Cliente cliente) {
        String sql = "INSERT INTO clientes (nombre, correo, telefono, estado) VALUES (?, ?, ?, ?)";
        try (Connection conexion = Conexion.conectar();
             PreparedStatement statement = conexion == null ? null : conexion.prepareStatement(sql)) {
            if (statement == null) {
                return false;
            }
            statement.setString(1, cliente.getNombre());
            statement.setString(2, cliente.getCorreo());
            statement.setString(3, cliente.getTelefono());
            statement.setBoolean(4, cliente.isEstado());
            return statement.executeUpdate() == 1;
        } catch (SQLException e) {
            System.err.println("Error al registrar cliente: " + e.getMessage());
            return false;
        }
    }

    public List<Cliente> listarClientes() {
        String sql = "SELECT * FROM clientes";
        List<Cliente> clientes = new ArrayList<>();
        try (Connection conexion = Conexion.conectar();
             PreparedStatement statement = conexion == null ? null : conexion.prepareStatement(sql);
             ResultSet resultado = statement == null ? null : statement.executeQuery()) {
            if (resultado == null) {
                return clientes;
            }
            while (resultado.next()) {
                clientes.add(new Cliente(
                        resultado.getInt("id"),
                        resultado.getString("nombre"),
                        resultado.getString("correo"),
                        resultado.getString("telefono"),
                        resultado.getBoolean("estado")
                ));
            }
        } catch (SQLException e) {
            System.err.println("Error al consultar clientes: " + e.getMessage());
        }
        return clientes;
    }

    public boolean actualizarCliente(Cliente cliente) {
        String sql = "UPDATE clientes SET nombre = ?, correo = ?, telefono = ?, estado = ? WHERE id = ?";
        try (Connection conexion = Conexion.conectar();
             PreparedStatement statement = conexion == null ? null : conexion.prepareStatement(sql)) {
            if (statement == null) {
                return false;
            }
            statement.setString(1, cliente.getNombre());
            statement.setString(2, cliente.getCorreo());
            statement.setString(3, cliente.getTelefono());
            statement.setBoolean(4, cliente.isEstado());
            statement.setInt(5, cliente.getId());
            return statement.executeUpdate() == 1;
        } catch (SQLException e) {
            System.err.println("Error al actualizar cliente: " + e.getMessage());
            return false;
        }
    }

    public boolean eliminarCliente(int id) {
        String sql = "DELETE FROM clientes WHERE id = ?";
        try (Connection conexion = Conexion.conectar();
             PreparedStatement statement = conexion == null ? null : conexion.prepareStatement(sql)) {
            if (statement == null) {
                return false;
            }
            statement.setInt(1, id);
            return statement.executeUpdate() == 1;
        } catch (SQLException e) {
            System.err.println("Error al eliminar cliente: " + e.getMessage());
            return false;
        }
    }
}