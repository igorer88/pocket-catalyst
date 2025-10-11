import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1759889806706 implements MigrationInterface {
  name = 'InitialSchema1759889806706'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Profiles" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "first_name" varchar(30), "last_name" varchar(30), "locale" varchar(10) NOT NULL DEFAULT ('en-US'), "display_currency" varchar(3) NOT NULL DEFAULT ('USD'), "extra_settings" text NOT NULL DEFAULT ('{}'), "user_id" varchar, CONSTRAINT "UQ_PROFILES_USER_ID" UNIQUE ("user_id"), CONSTRAINT "REL_054c67e064d68e6115e6d07d91" UNIQUE ("user_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_PROFILES_USER_ID" ON "Profiles" ("user_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "Permissions" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "action" varchar(50) NOT NULL, "subject" varchar(50) NOT NULL, "description" text)`
    )
    await queryRunner.query(
      `CREATE TABLE "RolePermissions" ("role_id" varchar NOT NULL, "permission_id" varchar NOT NULL, "granted_at" datetime NOT NULL DEFAULT (now()), CONSTRAINT "PK_ROLE_PERMISSIONS" UNIQUE ("role_id", "permission_id"), PRIMARY KEY ("role_id", "permission_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ROLE_PERMISSIONS_PERMISSION_ID" ON "RolePermissions" ("permission_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ROLE_PERMISSIONS_ROLE_ID" ON "RolePermissions" ("role_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "Roles" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "name" varchar(50) NOT NULL, "description" text, CONSTRAINT "UQ_8eadedb8470c92966389ecc2165" UNIQUE ("name"), CONSTRAINT "UQ_ROLES_NAME" UNIQUE ("name"))`
    )
    await queryRunner.query(
      `CREATE TABLE "UserRoles" ("user_id" varchar NOT NULL, "role_id" varchar NOT NULL, "assigned_at" datetime NOT NULL DEFAULT (now()), CONSTRAINT "PK_USER_ROLES" UNIQUE ("user_id", "role_id"), PRIMARY KEY ("user_id", "role_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_ROLES_ROLE_ID" ON "UserRoles" ("role_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_ROLES_USER_ID" ON "UserRoles" ("user_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "UserSecurity" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "user_id" varchar, "security_pin_hash" varchar, "pin_attempts" integer NOT NULL DEFAULT (0), "pin_locked_until" datetime, "recovery_hint" varchar(100), "recovery_email" varchar(50), "phone" varchar(15), CONSTRAINT "UQ_a9a3844e6c3310aa2cb40ead4b8" UNIQUE ("recovery_email"), CONSTRAINT "UQ_USER_SECURITY_RECOVERY_EMAIL" UNIQUE ("recovery_email"), CONSTRAINT "UQ_USER_SECURITY_USER_ID" UNIQUE ("user_id"), CONSTRAINT "REL_b960c461bb21bf2820b42ac2d6" UNIQUE ("user_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_SECURITY_USER_ID" ON "UserSecurity" ("user_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "email" varchar(50) NOT NULL, "password_hash" varchar NOT NULL, "is_active" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_USERS_EMAIL" UNIQUE ("email"))`
    )
    await queryRunner.query(
      `CREATE TABLE "AuditAdminLog" ("id" varchar PRIMARY KEY NOT NULL, "actor_id" varchar(32) NOT NULL, "action" varchar(100) NOT NULL, "target" varchar(100) NOT NULL, "details" text, "timestamp" datetime NOT NULL DEFAULT (now()))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_AUDIT_ADMIN_LOG_ACTOR_ID" ON "AuditAdminLog" ("actor_id") `
    )
    await queryRunner.query(`DROP INDEX "IDX_PROFILES_USER_ID"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_Profiles" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "user_id" varchar, "first_name" varchar(30), "last_name" varchar(30), "locale" varchar(10) NOT NULL DEFAULT ('en-US'), "display_currency" varchar(3) NOT NULL DEFAULT ('USD'), "extra_settings" text NOT NULL DEFAULT ('{}'), CONSTRAINT "UQ_PROFILES_USER_ID" UNIQUE ("user_id"), CONSTRAINT "REL_054c67e064d68e6115e6d07d91" UNIQUE ("user_id"), CONSTRAINT "FK_054c67e064d68e6115e6d07d914" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_Profiles"("id", "created_at", "updated_at", "deleted_at", "user_id", "first_name", "last_name", "locale", "display_currency", "extra_settings") SELECT "id", "created_at", "updated_at", "deleted_at",  "user_id", "first_name", "last_name", "locale", "display_currency", "extra_settings" FROM "Profiles"`
    )
    await queryRunner.query(`DROP TABLE "Profiles"`)
    await queryRunner.query(
      `ALTER TABLE "temporary_Profiles" RENAME TO "Profiles"`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_PROFILES_USER_ID" ON "Profiles" ("user_id") `
    )
    await queryRunner.query(`DROP INDEX "IDX_ROLE_PERMISSIONS_PERMISSION_ID"`)
    await queryRunner.query(`DROP INDEX "IDX_ROLE_PERMISSIONS_ROLE_ID"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_RolePermissions" ("role_id" varchar NOT NULL, "permission_id" varchar NOT NULL, "granted_at" datetime NOT NULL DEFAULT (now()), CONSTRAINT "PK_ROLE_PERMISSIONS" UNIQUE ("role_id", "permission_id"), CONSTRAINT "FK_52ea58017fb4c7d1e117cdcc4a8" FOREIGN KEY ("role_id") REFERENCES "Roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_073f7c14abfd15761ca3e9d85b4" FOREIGN KEY ("permission_id") REFERENCES "Permissions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("role_id", "permission_id"))`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_RolePermissions"("role_id", "permission_id", "granted_at") SELECT "role_id", "permission_id", "granted_at" FROM "RolePermissions"`
    )
    await queryRunner.query(`DROP TABLE "RolePermissions"`)
    await queryRunner.query(
      `ALTER TABLE "temporary_RolePermissions" RENAME TO "RolePermissions"`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ROLE_PERMISSIONS_PERMISSION_ID" ON "RolePermissions" ("permission_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ROLE_PERMISSIONS_ROLE_ID" ON "RolePermissions" ("role_id") `
    )
    await queryRunner.query(`DROP INDEX "IDX_USER_ROLES_ROLE_ID"`)
    await queryRunner.query(`DROP INDEX "IDX_USER_ROLES_USER_ID"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_UserRoles" ("user_id" varchar NOT NULL, "role_id" varchar NOT NULL, "assigned_at" datetime NOT NULL DEFAULT (now()), CONSTRAINT "PK_USER_ROLES" UNIQUE ("user_id", "role_id"), CONSTRAINT "FK_2bb0ddc40f4462c2652c79b811c" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e88dbd0599cdf519ee54af634a0" FOREIGN KEY ("role_id") REFERENCES "Roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("user_id", "role_id"))`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_UserRoles"("user_id", "role_id", "assigned_at") SELECT "user_id", "role_id", "assigned_at" FROM "UserRoles"`
    )
    await queryRunner.query(`DROP TABLE "UserRoles"`)
    await queryRunner.query(
      `ALTER TABLE "temporary_UserRoles" RENAME TO "UserRoles"`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_ROLES_ROLE_ID" ON "UserRoles" ("role_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_ROLES_USER_ID" ON "UserRoles" ("user_id") `
    )
    await queryRunner.query(`DROP INDEX "IDX_USER_SECURITY_USER_ID"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_UserSecurity" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "user_id" varchar, "security_pin_hash" varchar, "pin_attempts" integer NOT NULL DEFAULT (0), "pin_locked_until" datetime, "pin_hint" varchar(100), "recovery_email" varchar(50), "phone" varchar(15), CONSTRAINT "UQ_a9a3844e6c3310aa2cb40ead4b8" UNIQUE ("recovery_email"), CONSTRAINT "UQ_USER_SECURITY_RECOVERY_EMAIL" UNIQUE ("recovery_email"), CONSTRAINT "UQ_USER_SECURITY_USER_ID" UNIQUE ("user_id"), CONSTRAINT "REL_b960c461bb21bf2820b42ac2d6" UNIQUE ("user_id"), CONSTRAINT "FK_b960c461bb21bf2820b42ac2d65" FOREIGN KEY ("user_id") REFERENCES "Users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_UserSecurity"("id", "created_at", "updated_at", "deleted_at", "user_id", "security_pin_hash", "pin_attempts", "pin_locked_until", "pin_hint", "recovery_email", "phone") SELECT "id", "created_at", "updated_at", "deleted_at", "user_id", "security_pin_hash", "pin_attempts", "pin_locked_until", "pin_hint", "recovery_email", "phone" FROM "UserSecurity"`
    )
    await queryRunner.query(`DROP TABLE "UserSecurity"`)
    await queryRunner.query(
      `ALTER TABLE "temporary_UserSecurity" RENAME TO "UserSecurity"`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_SECURITY_USER_ID" ON "UserSecurity" ("user_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "temporary_Users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "email" varchar(50) NOT NULL, "password_hash" varchar NOT NULL, "is_active" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_USERS_EMAIL" UNIQUE ("email"), CONSTRAINT "FK_16d4f7d636df336db11d87413e3" FOREIGN KEY ("id") REFERENCES "UserSecurity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_Users"("id", "created_at", "updated_at", "deleted_at", "email", "password_hash", "is_active") SELECT "id", "created_at", "updated_at", "deleted_at", "email", "password_hash", "is_active" FROM "Users"`
    )
    await queryRunner.query(`DROP TABLE "Users"`)
    await queryRunner.query(`ALTER TABLE "temporary_Users" RENAME TO "Users"`)
    await queryRunner.query(`DROP INDEX "IDX_AUDIT_ADMIN_LOG_ACTOR_ID"`)
    await queryRunner.query(
      `CREATE TABLE "temporary_AuditAdminLog" ("id" varchar PRIMARY KEY NOT NULL, "actor_id" varchar(32) NOT NULL, "action" varchar(100) NOT NULL, "target" varchar(100) NOT NULL, "details" text, "timestamp" datetime NOT NULL DEFAULT (now()), CONSTRAINT "FK_814205221f7bd194b3161da3d47" FOREIGN KEY ("actor_id") REFERENCES "Users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `INSERT INTO "temporary_AuditAdminLog"("id", "actor_id", "action", "target", "details", "timestamp") SELECT "id", "actor_id", "action", "target", "details", "timestamp" FROM "AuditAdminLog"`
    )
    await queryRunner.query(`DROP TABLE "AuditAdminLog"`)
    await queryRunner.query(
      `ALTER TABLE "temporary_AuditAdminLog" RENAME TO "AuditAdminLog"`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_AUDIT_ADMIN_LOG_ACTOR_ID" ON "AuditAdminLog" ("actor_id") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_AUDIT_ADMIN_LOG_ACTOR_ID"`)
    await queryRunner.query(
      `ALTER TABLE "AuditAdminLog" RENAME TO "temporary_AuditAdminLog"`
    )
    await queryRunner.query(
      `CREATE TABLE "AuditAdminLog" ("id" varchar PRIMARY KEY NOT NULL, "actor_id" varchar(32) NOT NULL, "action" varchar(100) NOT NULL, "target" varchar(100) NOT NULL, "details" text, "timestamp" datetime NOT NULL DEFAULT (now()))`
    )
    await queryRunner.query(
      `INSERT INTO "AuditAdminLog"("id", "actor_id", "action", "target", "details", "timestamp") SELECT "id", "actor_id", "action", "target", "details", "timestamp" FROM "temporary_AuditAdminLog"`
    )
    await queryRunner.query(`DROP TABLE "temporary_AuditAdminLog"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_AUDIT_ADMIN_LOG_ACTOR_ID" ON "AuditAdminLog" ("actor_id") `
    )
    await queryRunner.query(`ALTER TABLE "Users" RENAME TO "temporary_Users"`)
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "email" varchar(50) NOT NULL, "password_hash" varchar NOT NULL, "is_active" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_USERS_EMAIL" UNIQUE ("email"))`
    )
    await queryRunner.query(
      `INSERT INTO "Users"("id", "created_at", "updated_at", "deleted_at", "email", "password_hash", "is_active") SELECT "id", "created_at", "updated_at", "deleted_at", "email", "password_hash", "is_active" FROM "temporary_Users"`
    )
    await queryRunner.query(`DROP TABLE "temporary_Users"`)
    await queryRunner.query(`DROP INDEX "IDX_USER_SECURITY_USER_ID"`)
    await queryRunner.query(
      `ALTER TABLE "UserSecurity" RENAME TO "temporary_UserSecurity"`
    )
    await queryRunner.query(
      `CREATE TABLE "UserSecurity" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime,  "user_id" varchar, "security_pin_hash" varchar, "pin_attempts" integer NOT NULL DEFAULT (0), "pin_locked_until" datetime, "pin_hint" varchar(100), "recovery_email" varchar(50), "phone" varchar(15), CONSTRAINT "UQ_a9a3844e6c3310aa2cb40ead4b8" UNIQUE ("recovery_email"), CONSTRAINT "UQ_USER_SECURITY_RECOVERY_EMAIL" UNIQUE ("recovery_email"), CONSTRAINT "UQ_USER_SECURITY_USER_ID" UNIQUE ("user_id"), CONSTRAINT "REL_b960c461bb21bf2820b42ac2d6" UNIQUE ("user_id"))`
    )
    await queryRunner.query(
      `INSERT INTO "UserSecurity"("id", "created_at", "updated_at", "deleted_at", "user_id", "security_pin_hash", "pin_attempts", "pin_locked_until", "pin_hint", "recovery_email", "phone") SELECT "id", "created_at", "updated_at", "deleted_at", "user_id", "interface_lock_pin_hash", "pin_attempts", "pin_locked_until", "recovery_hint", "recovery_email", "phone" FROM "temporary_UserSecurity"`
    )
    await queryRunner.query(`DROP TABLE "temporary_UserSecurity"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_SECURITY_USER_ID" ON "UserSecurity" ("user_id") `
    )
    await queryRunner.query(`DROP INDEX "IDX_USER_ROLES_USER_ID"`)
    await queryRunner.query(`DROP INDEX "IDX_USER_ROLES_ROLE_ID"`)
    await queryRunner.query(
      `ALTER TABLE "UserRoles" RENAME TO "temporary_UserRoles"`
    )
    await queryRunner.query(
      `CREATE TABLE "UserRoles" ("user_id" varchar NOT NULL, "role_id" varchar NOT NULL, "assigned_at" datetime NOT NULL DEFAULT (now()), CONSTRAINT "PK_USER_ROLES" UNIQUE ("user_id", "role_id"), PRIMARY KEY ("user_id", "role_id"))`
    )
    await queryRunner.query(
      `INSERT INTO "UserRoles"("user_id", "role_id", "assigned_at") SELECT "user_id", "role_id", "assigned_at" FROM "temporary_UserRoles"`
    )
    await queryRunner.query(`DROP TABLE "temporary_UserRoles"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_ROLES_USER_ID" ON "UserRoles" ("user_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_ROLES_ROLE_ID" ON "UserRoles" ("role_id") `
    )
    await queryRunner.query(`DROP INDEX "IDX_ROLE_PERMISSIONS_ROLE_ID"`)
    await queryRunner.query(`DROP INDEX "IDX_ROLE_PERMISSIONS_PERMISSION_ID"`)
    await queryRunner.query(
      `ALTER TABLE "RolePermissions" RENAME TO "temporary_RolePermissions"`
    )
    await queryRunner.query(
      `CREATE TABLE "RolePermissions" ("role_id" varchar NOT NULL, "permission_id" varchar NOT NULL, "granted_at" datetime NOT NULL DEFAULT (now()), CONSTRAINT "PK_ROLE_PERMISSIONS" UNIQUE ("role_id", "permission_id"), PRIMARY KEY ("role_id", "permission_id"))`
    )
    await queryRunner.query(
      `INSERT INTO "RolePermissions"("role_id", "permission_id", "granted_at") SELECT "role_id", "permission_id", "granted_at" FROM "temporary_RolePermissions"`
    )
    await queryRunner.query(`DROP TABLE "temporary_RolePermissions"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_ROLE_PERMISSIONS_ROLE_ID" ON "RolePermissions" ("role_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ROLE_PERMISSIONS_PERMISSION_ID" ON "RolePermissions" ("permission_id") `
    )
    await queryRunner.query(`DROP INDEX "IDX_PROFILES_USER_ID"`)
    await queryRunner.query(
      `ALTER TABLE "Profiles" RENAME TO "temporary_Profiles"`
    )
    await queryRunner.query(
      `CREATE TABLE "Profiles" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "user_id" varchar, "first_name" varchar(30), "last_name" varchar(30), "locale" varchar(10) NOT NULL DEFAULT ('en-US'), "display_currency" varchar(3) NOT NULL DEFAULT ('USD'), "extra_settings" text NOT NULL DEFAULT ('{}'), CONSTRAINT "UQ_PROFILES_USER_ID" UNIQUE ("user_id"), CONSTRAINT "REL_054c67e064d68e6115e6d07d91" UNIQUE ("user_id"))`
    )
    await queryRunner.query(
      `INSERT INTO "Profiles"("id", "created_at", "updated_at", "deleted_at", "first_name", "last_name", "locale", "display_currency", "extra_settings", "user_id") SELECT "id", "created_at", "updated_at", "deleted_at",  "user_id", "first_name", "last_name", "locale", "display_currency", "extra_settings" FROM "temporary_Profiles"`
    )
    await queryRunner.query(`DROP TABLE "temporary_Profiles"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_PROFILES_USER_ID" ON "Profiles" ("user_id") `
    )
    await queryRunner.query(`DROP INDEX "IDX_AUDIT_ADMIN_LOG_ACTOR_ID"`)
    await queryRunner.query(`DROP TABLE "AuditAdminLog"`)
    await queryRunner.query(`DROP TABLE "Users"`)
    await queryRunner.query(`DROP INDEX "IDX_USER_SECURITY_USER_ID"`)
    await queryRunner.query(`DROP TABLE "UserSecurity"`)
    await queryRunner.query(`DROP INDEX "IDX_USER_ROLES_USER_ID"`)
    await queryRunner.query(`DROP INDEX "IDX_USER_ROLES_ROLE_ID"`)
    await queryRunner.query(`DROP TABLE "UserRoles"`)
    await queryRunner.query(`DROP TABLE "Roles"`)
    await queryRunner.query(`DROP INDEX "IDX_ROLE_PERMISSIONS_ROLE_ID"`)
    await queryRunner.query(`DROP INDEX "IDX_ROLE_PERMISSIONS_PERMISSION_ID"`)
    await queryRunner.query(`DROP TABLE "RolePermissions"`)
    await queryRunner.query(`DROP TABLE "Permissions"`)
    await queryRunner.query(`DROP INDEX "IDX_PROFILES_USER_ID"`)
    await queryRunner.query(`DROP TABLE "Profiles"`)
  }
}
