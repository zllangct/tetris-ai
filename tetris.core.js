const ScoreMin = -999999999

function clone(tetris, cloneName = "default") {
    let temp = new Tetris({});
    temp.clone(tetris);
    temp.cloneDeep = tetris.cloneDeep ? tetris.cloneDeep + 1 : 1;
    temp.cloneName = cloneName;
    return temp;
}

function deepClone(target) {
    const map = new WeakMap()

    function isObject(target) {
        return (typeof target === 'object' && target) || typeof target === 'function'
    }

    function clone(data) {
        if (!isObject(data)) {
            return data
        }
        if ([Date, RegExp].includes(data.constructor)) {
            return new data.constructor(data)
        }
        if (typeof data === 'function') {
            // return new Function('return ' + data.toString())()
            return data.bind(this);
        }
        const exist = map.get(data)
        if (exist) {
            return exist
        }
        if (data instanceof Map) {
            const result = new Map()
            map.set(data, result)
            data.forEach((val, key) => {
                if (isObject(val)) {
                    result.set(key, clone(val))
                } else {
                    result.set(key, val)
                }
            })
            return result
        }
        if (data instanceof Set) {
            const result = new Set()
            map.set(data, result)
            data.forEach(val => {
                if (isObject(val)) {
                    result.add(clone(val))
                } else {
                    result.add(val)
                }
            })
            return result
        }
        const keys = Reflect.ownKeys(data)
        const allDesc = Object.getOwnPropertyDescriptors(data)
        const result = Object.create(Object.getPrototypeOf(data), allDesc)
        map.set(data, result)
        keys.forEach(key => {
            const val = data[key]
            if (isObject(val)) {
                result[key] = clone(val)
            } else {
                result[key] = val
            }
        })
        return result
    }

    return clone(target)
}

/*
 * @Author: geek
 * @LastEditors: geek
 * @Description: 【俄罗斯方块核心计算文件】依赖 tetris.config
 * @Src: https://geek.qq.com/tetris/js/tetris.core.js (编译前的源文件)
 */
// 游戏相关的配置
const config = {
    // 格子宽高及单位配置
    gridConfig: {
        width: 200,
        height: 400,
        row: 20,
        col: 10,
    },

    // 方块的颜色，可设置为不同颜色，当前设置为统一色
    colors: ['#00b050', '#00b050', '#00b050', '#00b050'],

    // 7 种类型方块（I,L,J,T,O,S,Z）的形态及每种类型对应的 4 个形态
    // 注：游戏使用的坐标系为 canvas 坐标系（坐标原点在左上角）详见：https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
    shapes: [
        [
            // I 型
            [
                [0, 0],
                [0, -1],
                [0, -2],
                [0, 1],
            ],
            [
                [0, 0],
                [1, 0],
                [2, 0],
                [-1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [0, -2],
                [0, 1],
            ],
            [
                [0, 0],
                [1, 0],
                [2, 0],
                [-1, 0],
            ],
        ],
        [
            // L 型
            [
                [0, 0],
                [0, -1],
                [0, -2],
                [1, 0],
            ],
            [
                [0, 0],
                [1, 0],
                [2, 0],
                [0, 1],
            ],
            [
                [0, 0],
                [-1, 0],
                [0, 1],
                [0, 2],
            ],
            [
                [0, 0],
                [0, -1],
                [-1, 0],
                [-2, 0],
            ],
        ],
        [
            // J 型
            [
                [0, 0],
                [0, -1],
                [0, -2],
                [-1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [1, 0],
                [2, 0],
            ],
            [
                [0, 0],
                [1, 0],
                [0, 1],
                [0, 2],
            ],
            [
                [0, 0],
                [-1, 0],
                [-2, 0],
                [0, 1],
            ],
        ],
        [
            // T 型
            [
                [0, 0],
                [1, 0],
                [0, 1],
                [-1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [0, 1],
                [-1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [1, 0],
                [-1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [1, 0],
                [0, 1],
            ],
        ],
        [
            // O 型
            [
                [0, 0],
                [0, -1],
                [1, -1],
                [1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [1, -1],
                [1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [1, -1],
                [1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [1, -1],
                [1, 0],
            ],
        ],
        [
            // S 型
            [
                [0, 0],
                [0, -1],
                [1, -1],
                [-1, 0],
            ],
            [
                [0, 0],
                [-1, 0],
                [-1, -1],
                [0, 1],
            ],
            [
                [0, 0],
                [0, -1],
                [1, -1],
                [-1, 0],
            ],
            [
                [0, 0],
                [-1, 0],
                [-1, -1],
                [0, 1],
            ],
        ],
        [
            // Z 型
            [
                [0, 0],
                [0, -1],
                [1, 0],
                [-1, -1],
            ],
            [
                [0, 0],
                [0, -1],
                [-1, 1],
                [-1, 0],
            ],
            [
                [0, 0],
                [0, -1],
                [1, 0],
                [-1, -1],
            ],
            [
                [0, 0],
                [0, -1],
                [-1, 1],
                [-1, 0],
            ],
        ],
    ],

    // 操作动作到提交类型的映射
    actionMap: {
        down: 'D', // 下降
        left: 'L', // 左移
        right: 'R', // 右移
        rotate: 'C', // 旋转
        new: 'N', // 新方块
    },

    // 操作动作到提交类型的反向映射
    actionMapReversed: {
        D: 'down',
        L: 'left',
        R: 'right',
        C: 'rotate',
        N: 'new',
    },
};

// 新方块的初始中心点在画布上的默认出现位置，默认从第1行第5列进场（方块的所有格子以此中心点为偏移量绘制）
// 注：游戏使用的坐标系为 canvas 坐标系（坐标原点在左上角）详见：https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
const defaultBrickCenterPos = [4, 0];

// 随机数生成函数的配置
const randomConfig = {
    a: 27073, // 乘子
    M: 32749, // 模数
    C: 17713, // 增量
    v: 12358, // 随机数种子
};

export default class Tetris {
    shapeIndex = 0; // 方块类型的索引
    stateIndex = 0; // 某个方块类型的在状态索引（一种类型的方块，由于可旋转，对应有多种状态）
    grids = []; // 当前所有格子的状态，已占用的值为绘制该格子的颜色值，未占用的值为空字符串
    brickCount = 0; // 已出现的方块个数
    curRandomNum = randomConfig.v; // 用于运算当前方块的随机数，初始值为随机数种子
    maxBrickCount = 10000; // 允许出现的方块总数，超过此值后结束游戏
    curBrickCenterPos = null; // 当前方块中心点在画布上的位置
    curBrickRawInfo = { pos: null, color: '' }; // 当前方块的原始信息（配置中的原始位置 + 方块颜色）
    curBrickInfo = {}; // 当前方块在画布上的信息（画布中的位置 + 方块颜色）注：方块每个格子在画布中的位置 = 每个格子的原始位置 + 方块中心点的位置
    nextBrickRawInfo = {}; // 下一个方块的原始信息
    score = 0; // 当前得分
    status = 'stopped'; // 当前游戏状态，stopped： 结束, running：运行中, paused：暂停, starting：初始中
    opRecord = []; // 游戏的操作记录，包含位移、旋转、新建方块等记录信息
    brickInfoList = [];

    /**
     * @description: 核心计算实例的构造函数
     * @param {object} opts 配置选项
     * @return {*}
     */
    constructor(opts = {}) {
        this.opts = opts;
        this.init(opts);
    }

    clone(tetris) {
            this.shapeIndex = deepClone(tetris.shapeIndex);
            this.stateIndex = deepClone(tetris.stateIndex);
            this.grids = deepClone(tetris.grids);
            this.brickCount = deepClone(tetris.brickCount);
            this.curRandomNum = deepClone(tetris.curRandomNum);
            this.maxBrickCount = deepClone(tetris.maxBrickCount);
            this.curBrickCenterPos = deepClone(tetris.curBrickCenterPos);
            this.curBrickRawInfo = deepClone(tetris.curBrickRawInfo);
            this.curBrickInfo = deepClone(tetris.curBrickInfo);
            this.nextBrickRawInfo = deepClone(tetris.nextBrickRawInfo);
            this.score = deepClone(tetris.score);
            this.status = deepClone(tetris.status);
            this.opRecord = deepClone(tetris.opRecord);
        }
        /**
         * @description: 实例化初始函数
         * @param {object} opts 配置选项
         * @return {*}
         */
    init(opts = {}) {
        Object.keys(config).forEach((key) => {
            this[key] = Object.assign(config[key], opts[key]);
        });
    }

    /**
     * @description: 设置当前游戏的状态
     * @param {string} status 游戏的状态值
     * @return {*}
     */
    setStatus(status) {
        this.status = status;
        this.opts.onStatusChange && this.opts.onStatusChange({ status, score: this.score });
    }

    /**
     * @description: 获取每局的初始格子，全部填充空字符串
     * @param {object} gridConfig 画布网格配置
     * @return {array}
     */
    getInitGrids(gridConfig) {
        const { col, row } = gridConfig;
        const ret = [];

        for (let i = 0; i < row; i++) {
            ret.push(new Array(col).fill(''));
        }

        return ret;
    }

    /**
     * @description: 获取当前方块的信息，包含：原始位置、画布位置、颜色
     * @param {number} randomNum 随机数
     * @param {number} brickCount 已出现的方块数
     * @param {array} brickCenterPos 当前方块的中心点位置
     * @return {object}
     */
    getBrickInfo(randomNum, brickCount, brickCenterPos, mute) {
        const brickRawInfo = this.getRawBrick(randomNum, brickCount, mute);
        const { isValid, brickInfo } = this.getBrickPos(brickRawInfo, brickCenterPos, true);

        return {
            isValid,
            brickRawInfo,
            brickInfo,
        };
    }

    /**
     * @description: 获取方块的原始信息，包含：原始位置、颜色
     * @param {number} randomNum 随机数
     * @param {number} brickCount 已出现的方块数
     * @param {boolean} mute 是否需要将当前索引值更新到实例属性
     * @return {object}
     */
    getRawBrick(randomNum, brickCount, mute) {
        const { shapes, colors } = this;
        const { shapeIndex, stateIndex, colorIndex } = this.getShapeInfo(randomNum, brickCount);

        if (!mute) {
            this.shapeIndex = shapeIndex;
            this.stateIndex = stateIndex;
        }

        return {
            pos: shapes[shapeIndex][stateIndex],
            color: colors[colorIndex],
        };
    }

    /**
     * @description: 从配置中按照【固定概率】获取原始方块类型和形态的索引
     * @param {number} randomNum 随机数
     * @param {number} brickCount 已出现的方块数
     * @return {object}
     */
    getShapeInfo(randomNum, brickCount) {
        const { shapes, colors } = this;

        const weightIndex = randomNum % 29; // 对形状的概率有一定要求：限制每种砖块的出现概率可以让游戏变得更有挑战性
        const stateIndex = brickCount % shapes[0].length; // 形态概率要求不高，随机即可
        const colorIndex = brickCount % colors.length; // 颜色概率要求不高，随机即可
        let shapeIndex = 0;

        // const testShapeIndex = Math.floor(brickCount / 4);
        // const testStateIndex = brickCount % shapes[0].length;

        // I,L,J,T,O,S,Z 型方块的概率权重分别为：2,3,3,4,5,6,6（和为29）
        if (weightIndex >= 0 && weightIndex <= 1) {
            shapeIndex = 0;
        } else if (weightIndex > 1 && weightIndex <= 4) {
            shapeIndex = 1;
        } else if (weightIndex > 4 && weightIndex <= 7) {
            shapeIndex = 2;
        } else if (weightIndex > 7 && weightIndex <= 11) {
            shapeIndex = 3;
        } else if (weightIndex > 11 && weightIndex <= 16) {
            shapeIndex = 4;
        } else if (weightIndex > 16 && weightIndex <= 22) {
            shapeIndex = 5;
        } else if (weightIndex > 22) {
            shapeIndex = 6;
        }

        return { shapeIndex, stateIndex, colorIndex };
        // return { shapeIndex: testShapeIndex, stateIndex: testStateIndex, colorIndex };
    }

    /**
     * @description: 随机数算法，基于入参 number 计算出符合概率要求的新随机数（该算法保证了不同玩家、不同设备下的随机数列一致，也即方块出现的顺序一致）
     * @param {number} v 随机数种子
     * @return {number}
     */
    getRandomNum(v) {
        const { a, C, M } = randomConfig; // a：乘子，C：模数、C：增量

        return (v * a + C) % M;
    }

    /**
     * @description: 根据方块的原始位置和中心点位置，得到方块在画布上的位置，并判断是否合法
     * @param {object} brickRawInfo 方块原始信息
     * @param {object} brickCenterPos 中心点位置
     * @return {object}
     */
    getBrickPos(brickRawInfo, brickCenterPos, forceUpdate = false) {
        const { colors, brickCount } = this;
        const [x, y] = brickCenterPos;
        const calced = brickRawInfo.pos.map(([posX, posY]) => {
            return [posX + x, posY + y];
        });

        const brickInfo = {
            pos: calced,
            color: colors[brickCount % colors.length],
        };

        if (this.isBrickPosValid(brickInfo)) {
            return {
                isValid: true,
                brickInfo,
            };
        }

        return {
            isValid: false,
            brickInfo: forceUpdate ? brickInfo : this.curBrickInfo,
        };
    }

    /**
     * @description: 当一个方块落定，更新格子（是否有消除行）、分数，并返回是否堆叠触顶或者超出允许的最大方块数量
     * @param {*}
     * @return {object}
     */
    update() {
        const { pos, color } = this.curBrickInfo;

        pos.forEach(([x, y]) => {
            this.grids[y] && (this.grids[y][x] = color);
        });

        const fullRowIndexes = [];
        let occupiedRowCount = 0;
        let occupiedGridCount = 0;

        this.grids.forEach((row, rowIndex) => {
            let occupiedGrirdCountPerRow = 0;

            // 每行已占用的格子计数
            row.forEach((grid) => {
                if (grid) {
                    occupiedGrirdCountPerRow += 1;
                }
            });

            // 当前行有被占用的格子，被占用行计数加1
            if (occupiedGrirdCountPerRow > 0) {
                occupiedRowCount += 1;
            }

            // 当前行所有格子都被占用，满行计数加1
            if (occupiedGrirdCountPerRow === row.length) {
                fullRowIndexes.push(rowIndex);
            }

            occupiedGridCount += occupiedGrirdCountPerRow;
        });

        const ret = {
            topTouched: occupiedRowCount === this.gridConfig.row,
            isRoundLimited: this.brickCount >= this.maxBrickCount,
        };

        // 触顶或者超过游戏的最大方块数量时，不计分数
        if (ret.topTouched || ret.isRoundLimited) {
            return ret;
        }

        let score = 0;
        // 分数计算规则（富贵险中求）：界面上堆砌的格子数乘以当前消除行数的得分系数
        // 当前消除行的得分系数：消除的行数越多，系数随之增加
        // 如：当前I型方块消除的行数为 18,17,15 共 3 行，则得分为 occupiedGridCount * 6
        switch (fullRowIndexes.length) {
            case 1:
                score += occupiedGridCount * 1;
                break;
            case 2:
                score += occupiedGridCount * 3;
                break;
            case 3:
                score += occupiedGridCount * 6;
                break;
            case 4:
                score += occupiedGridCount * 10;
                break;
            case 0:
            default:
                score += 0;
        }
        fullRowIndexes.forEach((index) => {
            this.grids.splice(index, 1);
            this.grids.unshift(new Array(this.gridConfig.col).fill(''));
        });

        this.score += score;
        this.opts.onScoreChange &&
            this.opts.onScoreChange({ status: this.status, score: this.score });

        ret.cal = {
            score: score,
            occupiedGridCount: occupiedGridCount,
            fullLine: fullRowIndexes.length
        }

        return ret;
    }

    /**
     * @description: 方块位置是否合法（边界检测）
     * @param {array} param.pos 当前方块在画布上的位置
     * @return {*}
     */
    isBrickPosValid({ pos }) {
        const { row, col } = this.gridConfig;
        const xRange = [0, col - 1];
        const yRange = [0, row - 1];
        let validCount = 0;

        // 逐点检测是否合法
        pos.forEach(([x, y]) => {
            const isHorizontalValid = x >= xRange[0] && x <= xRange[1]; // 水平方向是否合法
            const isVerticalValid = y <= yRange[1]; // 垂直方向是否合法
            const isCurGridValid = y < 0 || (this.grids[y] && !this.grids[y][x]); // 当前格子是否已被占用

            validCount += isHorizontalValid && isVerticalValid && isCurGridValid ? 1 : 0;
        });

        // 每个格子都合法才认为该方块合法
        return validCount === 4;
    }

    /**
     * @description: 获取当前方块在画布上各方向的格子间隙（也即各方向还能移动多少格）
     * @param {object} gridConfig 画布网格配置
     * @param {object} brickInfo 方块信息
     * @param {array} grids 画布网格信息
     * @return {object}
     */
    getBrickGaps(gridConfig, brickInfo, grids) {
            const ret = {
                top: gridConfig.row,
                right: gridConfig.col,
                bottom: gridConfig.row,
                left: gridConfig.col,
            };

            brickInfo.pos.forEach(([x, y]) => {
                const curGaps = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };

                // 左侧间隙计算
                for (let i = x - 1; i >= 0; i--) {
                    if (!(grids[y] && !grids[y][i]) && grids[y]) break;
                    curGaps.left += 1;
                }

                // 右侧间隙计算
                for (let i = x + 1; i < gridConfig.col; i++) {
                    if (!(grids[y] && !grids[y][i]) && grids[y]) break;
                    curGaps.right += 1;
                }

                // 顶部间隙计算
                for (let i = y - 1; i >= 0; i--) {
                    if (!(grids[i] && !grids[i][x]) && grids[i]) break;
                    curGaps.top += 1;
                }

                // 底部间隙计算
                for (let i = y + 1; i < gridConfig.row; i++) {
                    if (!(grids[i] && !grids[i][x]) && grids[i]) break;
                    curGaps.bottom += 1;
                }

                ['top', 'right', 'bottom', 'left'].forEach((dir) => {
                    if (curGaps[dir] < ret[dir]) {
                        ret[dir] = curGaps[dir];
                    }
                });
            });

            return ret;
        }
        /**
         * @description: 移动方块，并返回移动后各方向的空格间隙
         * @param {string} dir 移动方向
         * @param {number} stepCount 移动步数
         * @return {*}
         */
    move(dir, stepCount = 1) {
        const centerPos = this.curBrickCenterPos.slice();
        switch (dir) {
            case 'left':
                centerPos[0] -= stepCount;
                break;
            case 'right':
                centerPos[0] += stepCount;
                break;
            case 'down':
                centerPos[1] += stepCount;
                break;
        }

        const { isValid, brickInfo } = this.getBrickPos(this.curBrickRawInfo, centerPos);
        const gaps = this.getBrickGaps(this.gridConfig, this.curBrickInfo, this.grids);

        if (isValid) {
            this.curBrickInfo = brickInfo;
            this.curBrickCenterPos = centerPos;
            this.trackOp(dir, stepCount);
        }

        return gaps;
    }

    /**
     * @description: 旋转方块（实际为按照 stateIndex 渲染对应的方块形态）
     * @param {*}
     * @return {*}
     */
    rotate() {
        let { stateIndex } = this;

        if (this.stateIndex >= 3) {
            stateIndex = 0;
        } else {
            stateIndex += 1;
        }

        const curBrickRawInfo = {
            pos: this.shapes[this.shapeIndex][stateIndex],
            color: this.curBrickRawInfo.color,
        };

        const { isValid, brickInfo } = this.getBrickPos(curBrickRawInfo, this.curBrickCenterPos);

        if (isValid) {
            this.stateIndex = stateIndex;
            this.curBrickRawInfo = curBrickRawInfo;
            this.curBrickInfo = brickInfo;
            this.trackOp('rotate');
        }

    }

    indexRotate(shapeIndex, stateIndex, curBrickCenterPos) {
        const curBrickRawInfo = {
            pos: this.shapes[shapeIndex][stateIndex],
            color: "00b050",
        };

        const {isValid, brickInfo} = this.getBrickPos(curBrickRawInfo, curBrickCenterPos)

        return {
            stateIndex: stateIndex,
            brickRawInfo: curBrickRawInfo,
            isValid: isValid,
            brickInfo: brickInfo,
        }
    }

    /**
     * @description: 下坠方块到底部
     * @param {*}
     * @return {*}
     */
    drop() {
        const { bottom } = this.getBrickGaps(this.gridConfig, this.curBrickInfo, this.grids);

        this.move('down', bottom);
    }

    /**
     * @description: 记录方块相关的历史操作
     * @param {string} type 动作类型
     * @param {number} stepCount 动作次数
     * @return {*}
     */
    trackOp(type, stepCount = 1) {
        if (this.status !== 'running') return;
        type = this.actionMap[type];

        const prevOp = this.opRecord.pop();
        const {type: prevType, count: prevCount} = this.getOpInfo(prevOp)
        if (type === prevType && type !== 'N') {
            this.opRecord.push(`${prevType}${prevCount + stepCount}`);
        } else {
            prevOp && this.opRecord.push(prevOp);
            if (type === 'D' && stepCount > 1) {
                this.opRecord.push(`D${stepCount}`);
            } else {
                this.opRecord.push(`${type}${type !== 'N' ?  stepCount: ''}`);
            }
        }
    }

    /**
     * @description: 将动作和次数指令字符串转换为 type 和 count
     * @param {string} singleOpCmd 单个操作记录
     * @return {object}
     */
    getOpInfo(singleOpCmd = '') {
        singleOpCmd = singleOpCmd.trim();
        const reg = /^([LRDCN])(\d*)$/g;
        const [, type, count] = reg.exec(singleOpCmd) || ['', '', ''];

        return {
            type,
            count: count ? +count : undefined,
        };
    }

    /**
     * @description: 重置游戏相关状态
     * @param {function} onAnimate 动画函数
     * @return {*}
     */
    async reset(onAnimate) {
        this.score = 0;
        this.setStatus('starting');
        this.opRecord = [];
        this.brickCount = 0;
        this.curRandomNum = randomConfig.v;
        await this.clearGrids(onAnimate);
    }

    /**
     * @description: 初始化画布网格
     * @param {*}
     * @return {*}
     */
    initGrids() {
        this.grids = this.getInitGrids(this.gridConfig);
    }

    /**
     * @description: 初始化方块
     * @param {*}
     * @return {*}
     */
    initBrick() {
        this.curRandomNum = this.getRandomNum(this.curRandomNum);
        // 获取当前方块信息
        const curBrickCenterPos = defaultBrickCenterPos.slice();
        const { isValid, brickRawInfo, brickInfo } = this.getBrickInfo(
            this.curRandomNum,
            this.brickCount,
            curBrickCenterPos
        );

        // 获取下一个方块信息
        const { brickRawInfo: nextBrickRawInfo } = this.getBrickInfo(
            this.getRandomNum(this.curRandomNum),
            this.brickCount + 1,
            curBrickCenterPos,
            true
        );

        this.curBrickCenterPos = curBrickCenterPos;
        this.curBrickRawInfo = brickRawInfo;
        this.curBrickInfo = brickInfo;
        this.brickCount += 1;
        this.trackOp('new');

        if (isValid) {
            this.nextBrickRawInfo = nextBrickRawInfo;
        }

        return { isValid, brickCount: this.brickCount };
    }

    checkTop(pos) {
        for (let i = 0; i < pos.length; i++) {
            const [x, y] = pos[i];
            if (y <= 0) return true;
        }
        return false;
    }

    getMaxHeight(container) {
        let row = this.gridConfig.row;
        for (let i = 0; i < container.length; i++) {
            if (container[i] > 0) return row - i;
        }
    }

    totalBrickCount(container) {
        let count = 0;
        let col = this.gridConfig.col;
        for (let i = 0; i < container.length; i++) {
            for (let j = 0; j < col; j++) {
                if ((container[i] >> j) & 1) {
                    count++;
                }
            }
        }
        return count;
    }

    calcScore(container, height, pos) {
        let landingHeight = height;
        let rowsEliminated = this.rowEliminatedNums(container, pos); // 消行个数
        let rowTransitions = this.rowTransitions(container); // 行变换
        let colTransitions = this.colTransitions(container); // 列变化
        let emptyHoles = this.emptyHoles(container); // 空洞个数
        let wellNums = this.wellNums(container); // 井
        let brickCount = this.totalBrickCount(container);
        // console.log(pos, landingHeight, rowsEliminated, rowTransitions, colTransitions, emptyHoles, wellNums);

        if (rowsEliminated === 0 && this.checkTop(pos)) {
            return -99999999;
        }

        let A = -4.500158825082766;
        let B = 6.4181268101392694;
        let C = -3.2178882868487753;
        let D = -9.348695305445199;
        let E = -7.899265427351652;
        let F = -3.3855972247263626;
        let G = 2.8;

        let maxHeight = this.getMaxHeight(container);
        if (maxHeight <= 10 || brickCount <= 80) {
            B = -10;
        } else if (maxHeight >= 12 || brickCount > 110) {
            B = 20;
        }

        return A * landingHeight +
            B * rowsEliminated +
            C * rowTransitions +
            D * colTransitions +
            E * emptyHoles +
            F * wellNums +
            G * brickCount;
    }

    updateContainer(container) {
        let col = this.gridConfig.col;
        let filled = (1 << col) - 1;
        for (let i = 0; i < container.length; i++) {
            if (container[i] === filled) {
                container.splice(i, 1);
                container.unshift(0);
            }
        }
        return container;
    }

    rowEliminatedNums(container, pos) {
        const score = {
            0: 0,
            1 : 1,
            2: 3,
            3: 6,
            4: 10,
        }
        let col = this.gridConfig.col;
        let filled = (1 << col) - 1;
        let res = 0;
        let mark = 0;
        for (let i = 0; i < container.length; i++) {
            if (container[i] === filled) {
                res++;
                mark |= (1 << i);
            }
        }
        let count = 0;
        for (let i = 0; i < pos.length; i++) {
            const [y, x] = pos[i];
            if ((mark >> x) & 1) {
                count++;
            }
        }
        return score[res] * count;
    }

    rowTransitions(container) {
        let row = this.gridConfig.row;
        let col = this.gridConfig.col;
        let ret = 0;
        for (let i = 0; i < row; i++) {
            let lastBit = 1;
            for (let j = 0; j < col; j++) {
                let curBit = (container[i] >> j) & 1;
                if (lastBit !== curBit) ret++;
                lastBit = curBit;
            }
            if (lastBit === 0) ret++;
        }
        return ret;
    }

    colTransitions(container) {
        let row = this.gridConfig.row;
        let col = this.gridConfig.col;
        let ret = 0;
        for (let i = 0; i < col; i++) {
            let lastBit = 1;
            for (let j = 0; j < row; j++) {
                let curBit = (container[j] >> i) & 1;
                if (curBit !== lastBit) ret++;
                lastBit = curBit;
            }
            if (lastBit === 0) ret++;
        }
        return ret;
    }

    emptyHoles(container) {
        let row = this.gridConfig.row;
        let col = this.gridConfig.col;
        let holes = 0;
        for (let i = 0; i < col; i++) {
            let j = 0;
            while(j < row && !this.isFilled(container, i, j)) j++;
            for (; j < row; j++) {
                if (!this.isFilled(container, i, j)) {
                    holes++;
                }
            }
        }
        return holes;
    }

    wellNums(container) {
        let row = this.gridConfig.row;
        let col = this.gridConfig.col;
        let wellSums = 0;
        for (let i = 0; i < col; i++) {
            let t = 0;
            for (let j = 0; j < row; j++) {
                if (((container[j] >> i) & 1) === 0 &&
                    (i === col - 1 || ((container[j] >> (i + 1)) & 1) === 1) &&
                    (i === 0 || ((container[j] >> (i - 1)) & 1 === 1))) {
                    t++;
                } else {
                    wellSums += t * (t + 1) / 2;
                    t = 0;
                }
            }
            wellSums += t * (t + 1) / 2;
        }
        return wellSums;
    }

    columnHeight(colnum) {
        let grids = this.grids;
        let rownum = this.gridConfig.row;
        let r = 0;
        for (; r < rownum && grids[r][colnum] === ''; r++);
        return rownum - r;
    };

    /**
     * @description: 清屏操作（动画外置，作为参数传入）
     * @param {function} onAnimate 动画函数
     * @return {*}
     */
    async clearGrids(onAnimate) {
        for (let i = this.gridConfig.row; i >= 0; i--) {
            this.grids[i] = new Array(this.gridConfig.col).fill('#00b050');
            onAnimate && (await onAnimate(this.grids));
        }

        this.clearBrick();

        for (let i = 0; i < this.gridConfig.row; i++) {
            this.grids[i] = new Array(this.gridConfig.col).fill('');
            onAnimate && (await onAnimate(this.grids));
        }
    }

    /**
     * @description: 清除当前方块
     * @param {*}
     * @return {*}
     */
    clearBrick() {
        this.curBrickCenterPos = [];
        this.curBrickRawInfo = {};
        this.curBrickInfo = {};
    }

    getSnapshot() {
        const { grids, curBrickInfo } = this;
        let gridsStr = '     0  1  2  3  4  5  6  7  8  9 \n     ----------------------------\n';
        let brickStr = '     0  1  2  3  4  5  6  7  8  9 \n     ----------------------------\n';

        grids.forEach((row, rowIndex) => {
            let head = `${rowIndex}`;

            head = head.padStart(2, 0);
            gridsStr += `${head} |`;
            brickStr += `${head} |`;

            row.forEach((grid, colIndex) => {
                gridsStr += grid ? ' # ' : ' . ';

                const isBrickPos = curBrickInfo.pos.findIndex(([x, y]) => rowIndex === y && colIndex === x) > -1;
                brickStr += isBrickPos ? ' # ' : ' . ';
            });

            gridsStr += '\n';
            brickStr += '\n';
        });

        return {
            gridsStr,
            brickStr,
        };
    }

    initBrickInfoList() {
        let randomNum = this.curRandomNum;
        const curBrickCenterPos = defaultBrickCenterPos.slice();
        for (let i = 0; i <= 10050; i++) {
            randomNum = this.getRandomNum(randomNum);
            let info = this.getBrickInfo(randomNum, i, curBrickCenterPos);
            let {shapeIndex, stateIndex} = this.getShapeInfo(randomNum, i);
            info.stateIndex = stateIndex;
            let tmpList = [info];
            for (let j = 1; j <= 3; j++) {
                let tmpInfo = this.indexRotate(shapeIndex, (stateIndex + j) % 4, curBrickCenterPos);
                let ok = 1;
                for(let k = 0; k < tmpList.length; k++) {
                    if (this.checkRepeated(tmpList[k].brickInfo.pos, tmpInfo.brickInfo.pos)) {
                        ok = 0;
                    }
                }
                if (ok) tmpList.push(tmpInfo);
            }
            this.brickInfoList.push(tmpList);
        }
    }
    checkRepeated(A, B) {
        for (let i = 0; i < A.length; i++) {
            if (A[i][0] !== B[i][0] || A[i][1] !== B[i][1]) {
                return false;
            }
        }
        return true;
    }

    isFilled(container, col, row) {
        return (container[row] >> col) & 1;
    }
    getBrickGapsInfo(container, pos) {
        const ret = {
            top: this.gridConfig.row,
            right: this.gridConfig.col,
            bottom: this.gridConfig.row,
            left: this.gridConfig.col,
        };

        pos.forEach(([x, y]) => {
            const curGaps = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            };

            // 左侧间隙计算
            for (let i = x - 1; i >= 0; i--) {
                if (this.isFilled(container, i, y)) break;
                curGaps.left += 1;
            }

            // 右侧间隙计算
            for (let i = x + 1; i < this.gridConfig.col; i++) {
                if (this.isFilled(container, i, y)) break;
                curGaps.right += 1;
            }

            // 顶部间隙计算
            for (let i = y - 1; i >= 0; i--) {
                if (this.isFilled(container, x, i)) break;
                curGaps.top += 1;
            }

            // 底部间隙计算
            for (let i = y + 1; i < this.gridConfig.row; i++) {
                if (this.isFilled(container, x, i)) break;
                curGaps.bottom += 1;
            }

            ['top', 'right', 'bottom', 'left'].forEach((dir) => {
                if (curGaps[dir] < ret[dir]) {
                    ret[dir] = curGaps[dir];
                }
            });
        });

        return ret;
    }

    getMergeContainer(container, pos) {
        let ret = [...container];
        pos.forEach(([col, row]) => {
            ret[row] ^= (1 << col);
        })
        return ret;
    }

    // 最后停留的位置是否合法
    finalBrickPosValid(container, pos) {
        const { row, col } = this.gridConfig;
        const xRange = [0, col - 1];
        const yRange = [0, row - 1];
        let validCount = 0;

        pos.forEach(([x, y]) => {
            const isHorizontalValid = x >= xRange[0] && x <= xRange[1]; // 水平方向是否合法
            const isVerticalValid = y >= yRange[0] && y <= yRange[1]; // 垂直方向是否合法
            const isCurGridValid = !this.isFilled(container, x, y);
            validCount += isHorizontalValid && isVerticalValid && isCurGridValid ? 1 : 0;
        });

        return validCount === 4;
    }

    pushActionList(oriActionList, moveList) {
        let ret = [...oriActionList];
        let actionList = this.makeActionList(moveList);
        ret.push(actionList);
        return ret;
    }

    // dir 表示方向，0水平，1垂直, 2旋转
    makeActionList(moveList) {
        let actionList = [];
        for (let i = 0; i < moveList.length; i++) {
            const [dir, offset] = moveList[i];
            if (dir <= 1 && offset === 0) {
                continue;
            }
            if (dir === 0) {
                actionList.push({
                    type: offset < 0 ? "left":"right",
                    len: Math.abs(offset),
                })
            } else if (dir === 1) {
                actionList.push({
                    type: offset < 0 ? "top":"down",
                    len: Math.abs(offset),
                })
            } else if (dir === 2) {
                actionList.push({
                    type: "rotate",
                    len: 0,
                })
            }
        }
        return actionList;
    }

    checkInitPos(container, pos) {
        let col = this.gridConfig.col;
        let row = this.gridConfig.row;
        for (let i = 0; i < pos.length; i++) {
            const [x, y] = pos[i];
            if (x < 0 || x >= col) return false;
            if (y >= row) return false;
            if (y >= 0 && this.isFilled(container, x, y)) return false;
        }
        return true;
    }

    handleRotate(posA, posB, container, offset) {
        for (let i = -10; i <= 10; i++) {
            const posAM = posA.map(([x, y]) => {
                return [x + i + offset, y];
            })
            const posBM = posB.map(([x, y]) => {
                return [x + i + offset, y];
            })
            if (this.checkInitPos(container, posAM) && this.checkInitPos(container, posBM)) {
                return i;
            }
        }
        return -1000;
    }

    getBaseMoveList(curBrickInfoList, container, Index) {
        if (Index === 0) return {
            isValid: true,
            offset: 0,
            baseMoveList: [],
        };
        let moveList = [];
        let offset = 0;
        for (let i = 1; i <= Index; i++) {
            let curOffset = this.handleRotate(curBrickInfoList[i - 1].brickInfo.pos, curBrickInfoList[i].brickInfo.pos, container, offset);
            if (curOffset === -1000) {
                return {
                    isValid: false,
                    offset: 0,
                    baseMoveList : [],
                };
            }
            offset += curOffset;
            moveList.push([0, curOffset]);
            moveList.push([2, 0]);
        }
        return {
            isValid: true,
            offset: offset,
            baseMoveList: moveList,
        }
    }

    getValidPosList(container, curBrickInfoList) {
        let col = this.gridConfig.col;
        let row = this.gridConfig.row;
        let shapeNum = curBrickInfoList.length;
        let head = 0, tail = 0;
        let seq = [];
        let vis = [];
        for (let i = 0; i < row; i++) {
            let tmp = [];
            for (let j = 0; j < col; j++) {
                let arr = new Array(shapeNum).fill(0);
                tmp.push(arr);
            }
            vis.push(tmp);
        }
        if (this.checkInitPos(container, curBrickInfoList[0].brickInfo.pos)) {
            seq.push({
                centerPos: [4, 0],
                pos: curBrickInfoList[0].brickInfo.pos,
                opRecord: "",
                shapeIndex: 0,
            });
            vis[0][4][0] = 0;
        }
        while(head < seq.length) {
            let curItem = seq[head];
            let curPos = [...curItem.pos];
            const [centerX, centerY] = curItem.centerPos;
            let curShapeIndex = curItem.shapeIndex;
            let curOpRecord = curItem.opRecord;

            // 尝试旋转
            let nextShapeIndex = (curShapeIndex + 1) % shapeNum;
            let nextRawPos = curBrickInfoList[nextShapeIndex].brickRawInfo.pos;
            let rotatePos = nextRawPos.map(([x, y]) => {
                return [x + centerX, y + centerY];
            });
            if (this.checkInitPos(container, rotatePos) && vis[centerY][centerX][nextShapeIndex] === 0) {
                vis[centerY][centerX][nextShapeIndex] = 1;
                seq.push({
                    centerPos: [centerX, centerY],
                    pos: rotatePos,
                    opRecord: curOpRecord === "" ? "O" : curOpRecord + ",O",
                    shapeIndex: nextShapeIndex,
                })
            }

            // 尝试往左
            let leftPos = curPos.map(([x, y]) => {
                return [x - 1, y];
            });
            if (this.checkInitPos(container, leftPos) && vis[centerY][centerX - 1][curShapeIndex] === 0) {
                vis[centerY][centerX - 1][curShapeIndex] = 1;
                seq.push({
                    centerPos: [centerX - 1, centerY],
                    pos: leftPos,
                    opRecord: curOpRecord === "" ? "L" : curOpRecord + ",L",
                    shapeIndex: curShapeIndex,
                })
            }

            // 尝试往右
            let rightPos = curPos.map(([x, y]) => {
                return [x + 1, y];
            });
            if (this.checkInitPos(container, rightPos) && vis[centerY][centerX + 1][curShapeIndex] === 0) {
                vis[centerY][centerX + 1][curShapeIndex] = 1;
                seq.push({
                    centerPos: [centerX + 1, centerY],
                    pos: rightPos,
                    opRecord: curOpRecord === "" ? "R" : curOpRecord + ",R",
                    shapeIndex: curShapeIndex,
                })
            }

            // 尝试往下
            let downPos = curPos.map(([x, y]) => {
                return [x, y + 1];
            });
            if (this.checkInitPos(container, downPos) && vis[centerY + 1][centerX][curShapeIndex] === 0) {
                vis[centerY + 1][centerX][curShapeIndex] = 1;
                seq.push({
                    centerPos: [centerX, centerY + 1],
                    pos: downPos,
                    opRecord: curOpRecord === "" ? "D" : curOpRecord + ",D",
                    shapeIndex: curShapeIndex,
                })
            }
            head++;
        }
        let finalPos = [];
        for (let i = 0; i < seq.length; i++) {
            const {pos} = seq[i];
            // 如果还能往下走，过滤掉
            const downPos = pos.map(([x, y]) => {
                return [x, y + 1];
            });
            if (this.finalBrickPosValid(container, downPos)) {
                continue;
            }
            if (!this.finalBrickPosValid(container, pos)) {
                continue;
            }
            seq[i].opRecord = this.mergeOpRecord(seq[i].opRecord);
            finalPos.push(seq[i]);
        }
        /*
        console.log(finalPos.length);
        for (let i = 0; i < finalPos.length; i++) {
            console.log(finalPos[i]);
        }*/
        return finalPos;
    }

    mergeOpRecord(opRecord) {
        if (opRecord === "") {
            return [];
        }
        let opList = opRecord.split(",");
        let ret = [];
        let dir = {
            "L": 0,
            "R": 0,
            "D": 1,
            "O": 2,
        }
        let dirVal = {
            "L": -1,
            "R": 1,
            "D": 1,
            "O": 0,
        }
        for (let i = 0; i < opList.length; i++) {
            let curOp = opList[i];
            let j = i, curDir = dir[curOp];
            let val = 0;
            while(curDir <= 1 && j < opList.length && dir[opList[j]] === curDir) {
                val += dirVal[opList[j]];
                j++;
            }
            ret.push([curDir, val]);
            if (curDir <= 1) {
                i = j - 1;
            }
        }
        return ret;
    }

    testPosList(index) {
        let row = this.gridConfig.row;
        this.initGrids(); // 初始格子
        this.initBrickInfoList();
        let container = new Array(row).fill(0);
        this.getValidPosList(container, this.brickInfoList[index]);
    }

    findStep(container, score, actionList, curIndex, thinkDep) {
        if (thinkDep === 0) {
            return {
                score: score,
                actionList: actionList,
            }
        }
        let result = null;
        let validPosList = this.getValidPosList(container, this.brickInfoList[curIndex]);
        for (let i = 0; i < validPosList.length; i++) {
            const {pos, opRecord, centerPos} = validPosList[i];
            let tmpActionList = this.pushActionList(actionList, opRecord)
            let mergedContainer = this.getMergeContainer(container, pos);
            let curScore = this.calcScore(mergedContainer, this.gridConfig.row - centerPos[1], pos);
            mergedContainer = this.updateContainer(mergedContainer);
            let tmpResult = this.findStep(mergedContainer, score + curScore, tmpActionList, curIndex + 1, thinkDep - 1);
            if (tmpResult === null) continue;
            if (result === null || tmpResult.score > result.score) {
                result = tmpResult;
            }
        }
        return result;
    }

    printGrids() {
        let row = this.gridConfig.row;
        let col = this.gridConfig.col;
        for (let i = 0; i < row; i++) {
            let strList = [];
            for (let j = 0; j < col; j++) {
                if (this.grids[i][j] !== "") {
                    strList.push("#")
                } else {
                    strList.push(".")
                }
            }
            console.log(strList.join(" "))
        }
    }
}