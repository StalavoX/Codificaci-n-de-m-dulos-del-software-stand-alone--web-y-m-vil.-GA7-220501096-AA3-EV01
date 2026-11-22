public class Main {
    public static void main(String[] args) {
        ClienteDAO dao = new ClienteDAO();
        for (Cliente cliente : dao.listarClientes()) {
            System.out.printf(
                    "%d | %s | %s | %s | %s%n",
                    cliente.getId(),
                    cliente.getNombre(),
                    cliente.getCorreo(),
                    cliente.getTelefono(),
                    cliente.isEstado()
            );
        }
    }
}