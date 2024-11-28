import { UserModel } from '../models/user/model';

export const createDefaultAdmin = async () => {
  try {
    const adminExists = await UserModel.findOne({ email: 'admin@system.com' });

    if (!adminExists) {
      await UserModel.create({
        name: 'Admin',
        email: 'admin@system.com',
        password: 'Admin123!',
        role: 'ADMIN',
        isActive: true
      });
      console.log('✅ Usuario administrador creado exitosamente');
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  }
};