// ユーティリティ関数

// ノイズ生成関数（シンプレックスノイズの代わり）
class PerlinNoise {
    constructor(seed = 0) {
        this.seed = seed;
        this.permutation = this.generatePermutation(seed);
        this.p = [...this.permutation, ...this.permutation];
    }

    generatePermutation(seed) {
        const p = [];
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(this.seededRandom(seed + i) * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        return p;
    }

    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 8 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u = this.fade(xf);
        const v = this.fade(yf);

        const aa = this.p[this.p[xi] + yi];
        const ab = this.p[this.p[xi] + yi + 1];
        const ba = this.p[this.p[xi + 1] + yi];
        const bb = this.p[this.p[xi + 1] + yi + 1];

        const x1 = this.lerp(u, this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf));
        const x2 = this.lerp(u, this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1));
        return (this.lerp(v, x1, x2) + 1) / 2;
    }

    noise3D(x, y, z) {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;
        const zi = Math.floor(z) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const zf = z - Math.floor(z);
        const u = this.fade(xf);
        const v = this.fade(yf);
        const w = this.fade(zf);

        return (this.lerp(w, 
            this.lerp(v, 
                this.lerp(u, 0.5 + this.seededRandom(xi + yi + zi + this.seed) * 0.5, 0.5 + this.seededRandom(xi + 1 + yi + zi + this.seed) * 0.5),
                this.lerp(u, 0.5 + this.seededRandom(xi + yi + 1 + zi + this.seed) * 0.5, 0.5 + this.seededRandom(xi + 1 + yi + 1 + zi + this.seed) * 0.5)
            ),
            this.lerp(v,
                this.lerp(u, 0.5 + this.seededRandom(xi + yi + zi + 1 + this.seed) * 0.5, 0.5 + this.seededRandom(xi + 1 + yi + zi + 1 + this.seed) * 0.5),
                this.lerp(u, 0.5 + this.seededRandom(xi + yi + 1 + zi + 1 + this.seed) * 0.5, 0.5 + this.seededRandom(xi + 1 + yi + 1 + zi + 1 + this.seed) * 0.5)
            )
        )) / 2;
    }
}

// ベクトル計算
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiply(s) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector3(0, 0, 0);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
}

// レイキャスト
class Raycaster {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction.normalize();
    }

    raycast(blocks, maxDistance = 100) {
        let t = 0;
        while (t < maxDistance) {
            const point = this.origin.add(this.direction.multiply(t));
            const x = Math.floor(point.x);
            const y = Math.floor(point.y);
            const z = Math.floor(point.z);

            for (let block of blocks) {
                if (block.x === x && block.y === y && block.z === z && block.isOpaque && block.isOpaque()) {
                    return { block, distance: t };
                }
            }
            t += 0.1;
        }
        return null;
    }
}

// AABB衝突判定
class AABB {
    constructor(x1, y1, z1, x2, y2, z2) {
        this.min = new Vector3(Math.min(x1, x2), Math.min(y1, y2), Math.min(z1, z2));
        this.max = new Vector3(Math.max(x1, x2), Math.max(y1, y2), Math.max(z1, z2));
    }

    intersects(other) {
        return this.min.x < other.max.x && this.max.x > other.min.x &&
               this.min.y < other.max.y && this.max.y > other.min.y &&
               this.min.z < other.max.z && this.max.z > other.min.z;
    }

    static fromBlock(x, y, z) {
        return new AABB(x, y, z, x + 1, y + 1, z + 1);
    }
}

// パーティクル生成
function createBreakParticles(x, y, z, type, count = 5) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + Math.random() - 0.5,
            y: y + Math.random() - 0.5,
            z: z + Math.random() - 0.5,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 + 2,
            vz: (Math.random() - 0.5) * 8,
            life: 0.5,
            maxLife: 0.5,
            type: type
        });
    }
    return particles;
}

// 時間フォーマット
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

// 色計算
function getTimeColor(timeOfDay) {
    // 0-1で昼夜を表す
    let r, g, b;
    
    if (timeOfDay < 0.25) {
        // 夜 -> 朝
        const t = timeOfDay / 0.25;
        r = 0.3 + t * 0.4;
        g = 0.3 + t * 0.5;
        b = 0.5 + t * 0.3;
    } else if (timeOfDay < 0.5) {
        // 朝 -> 昼
        const t = (timeOfDay - 0.25) / 0.25;
        r = 0.7 + t * 0.3;
        g = 0.8 + t * 0.2;
        b = 0.8 - t * 0.3;
    } else if (timeOfDay < 0.75) {
        // 昼 -> 夕方
        const t = (timeOfDay - 0.5) / 0.25;
        r = 1.0 - t * 0.2;
        g = 1.0 - t * 0.3;
        b = 0.5 - t * 0.2;
    } else {
        // 夕方 -> 夜
        const t = (timeOfDay - 0.75) / 0.25;
        r = 0.8 - t * 0.5;
        g = 0.7 - t * 0.4;
        b = 0.3 - t * 0.15;
    }
    
    return `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)})`;
}
