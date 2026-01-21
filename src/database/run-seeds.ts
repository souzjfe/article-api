import { AppDataSource } from './typeorm';
import { runSeeders } from 'typeorm-extension';

void (async () => {
  try {
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();

    console.log('🚀 Running typeorm-extension seeds...');
    await runSeeders(AppDataSource);

    console.log('✨ Seeding complete!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
})();
