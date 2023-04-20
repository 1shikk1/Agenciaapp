const express = require('express');
const router = express.Router();

const sql = require('mssql');
const config = {
    user: '<Franchesko>',
    password: '<>',
    server: '<DESKTOP-8CKPOCI>',
    database: '<Agencia_San_Isidro>',
    options: {
        encrypt: true
    }
}

// Obtener lista de contratos
router.get('/contratos', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let contratos = await pool.request().query("SELECT * from Contratos");
        res.json(contratos.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener lista de empresas
router.get('/empresas', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let empresas = await pool.request().query("SELECT * from Empresas");
        res.json(empresas.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener lista de personal
router.get('/personal', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let personal = await pool.request().query("SELECT * from Personal");
        res.json(personal.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/contratos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('IdContrato', sql.Int, id)
        .query('DELETE FROM Contratos WHERE IdContrato = @IdContrato');
      if (result.rowsAffected[0] > 0) {
        res.send(`Contrato con ID ${id} eliminado correctamente`);
      } else {
        res.status(404).send(`No se encontró un contrato con ID ${id}`);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar un contrato');
    }
  });

  router.get('/empresas', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let empresas = await pool.request().query("SELECT * from Empresas");
        res.json(empresas.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obtener información de una empresa específica
router.get('/empresas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config);
        let empresa = await pool.request()
            .input('IdEmpresa', sql.Int, id)
            .query('SELECT * from Empresas WHERE IdEmpresa = @IdEmpresa');
        if (empresa.recordset.length === 0) {
            res.status(404).send(`No se encontró una empresa con ID ${id}`);
        } else {
            res.json(empresa.recordset[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Agregar una nueva empresa
router.post('/empresas', async (req, res) => {
    try {
        const { NombreEmpresa, Telefono, Direccion } = req.body;
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('NombreEmpresa', sql.NVarChar, NombreEmpresa)
            .input('Telefono', sql.NVarChar, Telefono)
            .input('Direccion', sql.NVarChar, Direccion)
            .query('INSERT INTO Empresas (NombreEmpresa, Telefono, Direccion) VALUES (@NombreEmpresa, @Telefono, @Direccion); SELECT SCOPE_IDENTITY() as IdEmpresa');
        const newEmpresa = {
            IdEmpresa: result.recordset[0].IdEmpresa,
            NombreEmpresa,
            Telefono,
            Direccion
        };
        res.json(newEmpresa);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Editar una empresa existente
router.put('/empresas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { NombreEmpresa, Telefono, Direccion } = req.body;
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('IdEmpresa', sql.Int, id)
            .input('NombreEmpresa', sql.NVarChar, NombreEmpresa)
            .input('Telefono', sql.NVarChar, Telefono)
            .input('Direccion', sql.NVarChar, Direccion)
            .query('UPDATE Empresas SET NombreEmpresa = @NombreEmpresa, Telefono = @Telefono, Direccion = @Direccion WHERE IdEmpresa = @IdEmpresa');
        if (result.rowsAffected[0] === 0) {
            res.status(404).send(`No se encontró una empresa con ID ${id}`);
        } else {
            const updatedEmpresa = {
                IdEmpresa: id,
                NombreEmpresa,
                Telefono,
                Direccion
            };
            res.json(updatedEmpresa);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/empresas/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('IdEmpresa', sql.Int, id)
        .query('DELETE FROM Empresas WHERE IdEmpresa = @IdEmpresa');
      if (result.rowsAffected[0] > 0) {
        res.send(`Empresa con ID ${id} eliminada correctamente`);
      } else {
        res.status(404).send(`No se encontró una empresa con ID ${id}`);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar una empresa');
    }
  });
  
  // Obtener lista de personal
router.get('/personal', async (req, res) => {
    try {
      let pool = await sql.connect(config);
      let personal = await pool.request().query("SELECT * from Personal");
      res.json(personal.recordset);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // Obtener un registro de personal por ID
  router.get('/personal/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let pool = await sql.connect(config);
      let personal = await pool.request()
        .input('IdPersonal', sql.Int, id)
        .query('SELECT * from Personal WHERE IdPersonal = @IdPersonal');
      if (personal.recordset.length > 0) {
        res.json(personal.recordset[0]);
      } else {
        res.status(404).send(`No se encontró un registro de personal con ID ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // Agregar un registro de personal
  router.post('/personal', async (req, res) => {
    try {
      const { Nombres, Apellidos, Edad, Telefono } = req.body;
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('Nombres', sql.VarChar, Nombres)
        .input('Apellidos', sql.VarChar, Apellidos)
        .input('Edad', sql.Int, Edad)
        .input('Telefono', sql.VarChar, Telefono)
        .query('INSERT INTO Personal (Nombres, Apellidos, Edad, Telefono) VALUES (@Nombres, @Apellidos, @Edad, @Telefono); SELECT SCOPE_IDENTITY() AS IdPersonal');
      res.json({ IdPersonal: result.recordset[0].IdPersonal, Nombres, Apellidos, Edad, Telefono });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // Actualizar un registro de personal
  router.put('/personal/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { Nombres, Apellidos, Edad, Telefono } = req.body;
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('IdPersonal', sql.Int, id)
        .input('Nombres', sql.VarChar, Nombres)
        .input('Apellidos', sql.VarChar, Apellidos)
        .input('Edad', sql.Int, Edad)
        .input('Telefono', sql.VarChar, Telefono)
        .query('UPDATE Personal SET Nombres = @Nombres, Apellidos = @Apellidos, Edad = @Edad, Telefono = @Telefono WHERE IdPersonal = @IdPersonal');
      if (result.rowsAffected[0] > 0) {
        res.send(`Registro de personal con ID ${id} actualizado correctamente`);
      } else {
        res.status(404).send(`No se encontró un registro de personal con ID ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  app.delete('/personal/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('IdPersonal', sql.Int, id)
        .query('DELETE FROM Personal WHERE IdPersonal = @IdPersonal');
      if (result.rowsAffected[0] > 0) {
        res.send(`Personal con ID ${id} eliminado correctamente`);
      } else {
        res.status(404).send(`No se encontró un registro de personal con ID ${id}`);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar un registro de personal');
    }
  });
  
  
module.exports = router;