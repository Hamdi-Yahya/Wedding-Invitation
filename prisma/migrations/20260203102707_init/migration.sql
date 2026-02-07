-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partner_1_name` VARCHAR(191) NOT NULL,
    `partner_2_name` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(191) NULL,
    `event_date` DATETIME(3) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `venue_name` VARCHAR(191) NOT NULL,
    `venue_address` TEXT NOT NULL,
    `map_link_url` TEXT NULL,
    `wa_template_msg` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theme_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `theme_name` VARCHAR(191) NOT NULL DEFAULT 'Modern Pink',
    `primary_color` VARCHAR(191) NOT NULL DEFAULT '#E91E8C',
    `secondary_color` VARCHAR(191) NOT NULL DEFAULT '#FFF9F9',
    `font_family` VARCHAR(191) NOT NULL DEFAULT 'Parisienne',
    `background_image_url` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'Regular',
    `slug` VARCHAR(191) NOT NULL,
    `qr_code_string` VARCHAR(191) NOT NULL,
    `rsvp_status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `guest_count` INTEGER NOT NULL DEFAULT 1,
    `check_in_time` DATETIME(3) NULL,
    `gift_type` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `guests_slug_key`(`slug`),
    UNIQUE INDEX `guests_qr_code_string_key`(`qr_code_string`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guest_id` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wishes` ADD CONSTRAINT `wishes_guest_id_fkey` FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
