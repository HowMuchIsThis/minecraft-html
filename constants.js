// ゲーム定数
const CONSTANTS = {
    // ゲーム設定
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    GAME_MODE: 'creative',
    
    // ブロック
    BLOCK_SIZE: 16,
    RENDER_DISTANCE: 16,
    
    // 世界
    WORLD_WIDTH: 256,
    WORLD_HEIGHT: 256,
    WORLD_DEPTH: 256,
    BEDROCK_LEVEL: -32,
    SEA_LEVEL: 62,
    
    // プレイヤー
    PLAYER_HEIGHT: 1.8,
    PLAYER_WIDTH: 0.6,
    PLAYER_SPEED: 5,
    PLAYER_JUMP_POWER: 10,
    PLAYER_FOV: 70,
    GRAVITY: 20,
    
    // 時間システム
    DAY_LENGTH: 180000,
    NIGHT_LENGTH: 60000,
    
    // モブ
    MOB_SPAWN_RANGE: 32,
    MOB_VIEW_RANGE: 16,
    MOB_IDLE_SPEED: 2,
    MOB_CHASE_SPEED: 6,
    
    // ブロック種類
    BLOCK_TYPES: {
        STONE: 'stone',
        DIRT: 'dirt',
        GRASS: 'grass',
        LOG: 'log',
        LEAVES: 'leaves',
        SAND: 'sand',
        SANDSTONE: 'sandstone',
        WATER: 'water',
        LAVA: 'lava',
        COAL_ORE: 'coal_ore',
        IRON_ORE: 'iron_ore',
        COBBLESTONE: 'cobblestone',
        PLANKS: 'planks',
        CRAFTING_TABLE: 'crafting_table',
        FURNACE: 'furnace',
        TNT: 'tnt',
        BEDROCK: 'bedrock'
    },
    
    // バイオームタイプ
    BIOME_TYPES: {
        FOREST: 'forest',
        DESERT: 'desert',
        RIVER: 'river',
        PLAINS: 'plains'
    },
    
    // モブタイプ
    MOB_TYPES: {
        PIG: 'pig',
        SHEEP: 'sheep',
        COW: 'cow',
        ZOMBIE: 'zombie',
        CREEPER: 'creeper'
    },
    
    // インベントリ
    HOTBAR_SIZE: 9,
    INVENTORY_SIZE: 36,
    
    // 色
    COLORS: {
        DIRT: '#8B6914',
        GRASS: '#558C2B',
        STONE: '#7F7F7F',
        COBBLESTONE: '#6F6F6F',
        SAND: '#C5A742',
        SANDSTONE: '#BFA742',
        LOG: '#5A3E1F',
        LEAVES: '#2E8B57',
        WATER: '#3F76E4',
        LAVA: '#FF6B1F',
        COAL_ORE: '#4A4A4A',
        IRON_ORE: '#8A7A5F',
        PLANKS: '#9B5F2E',
        TNT: '#FF4444',
        BEDROCK: '#1A1A1A'
    },
    
    // ツール
    TOOL_TYPES: {
        WOODEN_PICKAXE: 'wooden_pickaxe',
        STONE_PICKAXE: 'stone_pickaxe',
        IRON_PICKAXE: 'iron_pickaxe',
        WOODEN_AXE: 'wooden_axe',
        STONE_AXE: 'stone_axe',
        IRON_AXE: 'iron_axe'
    }
};
