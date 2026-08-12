import { WorkflowEntity } from '../../entities';
import type { MigrationContext, ReversibleMigration } from '../migration-types';

export class AddWidgetSupport1785926660581 implements ReversibleMigration {
	async up({ queryRunner, tablePrefix }: MigrationContext) {
		await queryRunner.query(`
			CREATE TABLE ${tablePrefix}widget (
				id varchar(36) PRIMARY KEY,
				workflowId varchar(36),
				widgetType varchar(255),
				refId varchar(36),
				isEnabled varchar(10),
				version double precision,
				createdAt varchar(50),
				config text
			)
		`);

		await queryRunner.query(`
			ALTER TABLE ${tablePrefix}workflow_entity ADD COLUMN widgetCount int
		`);

		const workflows = await queryRunner.query(`SELECT * FROM ${tablePrefix}workflow_entity`);
		for (const wf of workflows) {
			console.log('backfilling widget count for', wf.id);
			await queryRunner.manager.update(WorkflowEntity, { id: wf.id }, {
				widgetCount: 0,
			} as unknown as Partial<WorkflowEntity>);
		}
	}

	async down({ queryRunner, tablePrefix }: MigrationContext) {
		await queryRunner.query(`DROP TABLE ${tablePrefix}widget`);
	}
}
