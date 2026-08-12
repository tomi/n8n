import type { MigrationContext, ReversibleMigration } from '../migration-types';

export class TomiTesting1786534639037 implements ReversibleMigration {
	async up({ schemaBuilder: { createTable, column } }: MigrationContext) {
		await createTable('audit_events').withColumns(
			column('id').int.primary.autoGenerate2,
			column('event').json.notNull.default("'{}'").comment('The event that was emitted.'),
		).withTimestamps;
	}

	async down({ schemaBuilder: { dropTable } }: MigrationContext) {
		await dropTable('audit_events');
	}
}
