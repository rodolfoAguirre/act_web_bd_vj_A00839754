import { connectDB } from './utils/sql.js';
import { getSalt, hashPassword } from './utils/hash.js';
import dotenv from 'dotenv';

dotenv.config();

const migratePasswords = async () => {
    const sql = await connectDB();

    try {
        const result = await sql.query('SELECT user_id, password FROM users');

        for (const user of result.rows) {
            const plainPassword = user.password;

            // Generar nueva sal y hash
            const salt = getSalt();
            const { hash } = hashPassword(plainPassword, salt);
            const newPassword = salt + hash;

            // Actualizar contraseña
            await sql.query('UPDATE users SET password = $1 WHERE user_id = $2', [
                newPassword,
                user.user_id,
            ]);

            console.log(`✅ Hasheada contraseña para usuario ID: ${user.user_id}`);
        }

        console.log('\n🎉 Migración de contraseñas completada con éxito.');
    } catch (err) {
        console.error('❌ Error al migrar contraseñas:', err);
    } finally {
        sql.end();
    }
};

migratePasswords();
