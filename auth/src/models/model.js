import pool from '../config/db.js';

const User = {
  async create(username, password) {
    const result = await pool.query(
      'INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [username]
    );
    return result.rows[0];
  },

async crearPerfil(datos) {
    const client = await pool.connect();
    try {
      const {
        nombre, 
        correo,
        contrasena,
        deportes_preferidos,
        horario_disponible,
        lat,
        lon,
        transporte
      } = datos;

      const insertQuery = `
        INSERT INTO auth.usuarios 
        (nombre, correo, contraseña_hash, deportes_preferidos, horario_disponible, lat, lon, transporte) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        nombre, 
        correo,
        contrasena,
        deportes_preferidos,
        horario_disponible,
        lat,
        lon,
        transporte
      ]);

      return result.rows[0];

    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },

  async obtenerUsuarioPorId(id) {
    try {
      const query = `
        SELECT id, nombre, correo, fecha_registro, foto_perfil,
               deportes_preferidos, horario_disponible, lat, lon, transporte
        FROM auth.usuarios 
        WHERE id = $1
      `;
      console.log(query)
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;

    } catch (error) {
      throw error;
    }
  },

};

export default User;
