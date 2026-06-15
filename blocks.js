// ブロック定義
class Block {
    constructor(type, x, y, z, data = {}) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = data;
    }

    getHardness() {
        const hardness = {
            'stone': 1.5,
            'dirt': 0.5,
            'grass': 0.6,
            'log': 2,
            'leaves': 0.2,
            'sand': 0.5,
            'sandstone': 0.8,
            'water': -1,
            'lava': -1,
            'coal_ore': 3,
            'iron_ore': 3,
            'cobblestone': 2,
            'planks': 2,
            'crafting_table': 2.5,
            'furnace': 3.5,
            'tnt': 0.5,
            'bedrock': 50
        };
        return hardness[this.type] || 1;
    }

    getToolRequired() {
        const toolMap = {
            'stone': 'pickaxe',
            'cobblestone': 'pickaxe',
            'iron_ore': 'iron_pickaxe',
            'coal_ore': 'pickaxe',
            'furnace': 'pickaxe',
            'crafting_table': 'axe',
            'log': 'axe'
        };
        return toolMap[this.type];
    }

    getDrops(tool = null) {
        const drops = {
            'stone': ['cobblestone'],
            'dirt': ['dirt'],
            'grass': ['dirt'],
            'log': ['log'],
            'leaves': [],
            'sand': ['sand'],
            'sandstone': ['sandstone'],
            'coal_ore': ['coal_ore'],
            'iron_ore': ['iron_ore'],
            'cobblestone': ['cobblestone'],
            'planks': ['planks'],
            'crafting_table': ['crafting_table'],
            'furnace': ['furnace'],
            'tnt': ['tnt']
        };
        return drops[this.type] || [this.type];
    }

    isOpaque() {
        const transparent = ['leaves', 'water', 'lava'];
        return !transparent.includes(this.type);
    }

    isFluid() {
        return this.type === 'water' || this.type === 'lava';
    }

    canPlaceOn(blockBelow) {
        if (!blockBelow) return true;
        if (blockBelow.isFluid()) return false;
        return true;
    }

    static getColor(type) {
        const colorMap = {
            'stone': '#7F7F7F',
            'dirt': '#8B6914',
            'grass': '#558C2B',
            'log': '#5A3E1F',
            'leaves': '#2E8B57',
            'sand': '#C5A742',
            'sandstone': '#BFA742',
            'water': '#3F76E4',
            'lava': '#FF6B1F',
            'coal_ore': '#4A4A4A',
            'iron_ore': '#8A7A5F',
            'cobblestone': '#6F6F6F',
            'planks': '#9B5F2E',
            'crafting_table': '#8B4513',
            'furnace': '#5A5A5A',
            'tnt': '#FF4444',
            'bedrock': '#1A1A1A'
        };
        return colorMap[type] || '#FFFFFF';
    }
}

// ブロックマネージャー
class BlockManager {
    constructor(world) {
        this.world = world;
        this.blocks = new Map();
    }

    setBlock(x, y, z, blockType) {
        const key = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
        if (blockType) {
            this.blocks.set(key, new Block(blockType, x, y, z));
        } else {
            this.blocks.delete(key);
        }
    }

    getBlock(x, y, z) {
        const key = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
        return this.blocks.get(key);
    }

    removeBlock(x, y, z) {
        const block = this.getBlock(x, y, z);
        if (block) {
            this.blocks.delete(`${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`);
            return block.getDrops();
        }
        return [];
    }

    isBlockSolid(x, y, z) {
        const block = this.getBlock(x, y, z);
        return block && block.isOpaque() && !block.isFluid();
    }

    isBlockEmpty(x, y, z) {
        return !this.getBlock(x, y, z);
    }

    canPlaceBlock(x, y, z, blockType) {
        const block = this.getBlock(x, y, z);
        if (block) return false;

        const blockBelow = this.getBlock(x, y - 1, z);
        const newBlock = new Block(blockType, x, y, z);
        return newBlock.canPlaceOn(blockBelow);
    }

    getAllBlocks() {
        return Array.from(this.blocks.values());
    }

    getBlocksInRange(centerX, centerY, centerZ, range) {
        const blocks = [];
        for (let [, block] of this.blocks) {
            const dx = Math.abs(block.x - centerX);
            const dy = Math.abs(block.y - centerY);
            const dz = Math.abs(block.z - centerZ);
            if (dx <= range && dy <= range && dz <= range) {
                blocks.push(block);
            }
        }
        return blocks;
    }

    save() {
        const data = [];
        for (let [, block] of this.blocks) {
            data.push({
                x: block.x,
                y: block.y,
                z: block.z,
                type: block.type,
                data: block.data
            });
        }
        return data;
    }

    load(data) {
        this.blocks.clear();
        for (let blockData of data) {
            this.setBlock(blockData.x, blockData.y, blockData.z, blockData.type);
        }
    }
}
