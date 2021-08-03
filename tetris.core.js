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

        // console.log(this.getSnapshot().brickStr);
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

    calcScore(container, height) {
        let landingHeight = height;
        let rowsEliminated = this.rowEliminatedNums(container); // 消行个数
        let rowTransitions = this.rowTransitions(container); // 行变换
        let colTransitions = this.colTransitions(container); // 列变化
        let emptyHoles = this.emptyHoles(container); // 空洞个数
        let wellNums = this.wellNums(container); // 井

        return (-4.500158825082766) * landingHeight +
            (3.4181268101392694) * rowsEliminated +
            (-3.2178882868487753) * rowTransitions +
            (-9.348695305445199) * colTransitions +
            (-7.899265427351652) * emptyHoles +
            (-3.3855972247263626) * wellNums
    }

    rowEliminatedNums(container) {
        let col = this.gridConfig.col;
        let filled = (1 << col) - 1;
        let res = 0;
        for (let i = 0; i < container.length; i++) {
            if (container[i] === filled) res++;
        }
        return res;
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
        }
        return ret;
    }

    emptyHoles(container) {
        let row = this.gridConfig.row;
        let col = this.gridConfig.col;
        let holes = 0;
        let rowHoles = 0;
        let prevRow = 0;
        for (let i = 0; i < row; i++) {
            rowHoles = ~container[i] & (prevRow | rowHoles);
            for (let j = 0; j < col; i++) {
                holes += ((rowHoles >> j) & 1);
            }
            prevRow = container[i];
        }
        return holes;
    }

    wellNums(container) {
        let row = this.gridConfig.row;
        let col = this.gridConfig.col;
        let wellSums = 0;
        for (let i = 1; i < col - 1; i++) {
            for (let j = 0; j < row; j++) {
                if (((container[j] >> i) & 1) === 0 &&
                    ((container[j] >> (i + 1)) & 1) === 1 &&
                    ((container[j] >> (i - 1)) & 1) === 1) {
                    let k = j;
                    while(k < row && ((container[k] >> i) & 1) === 0) {
                        wellSums++; k++;
                    }
                }
            }
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

    initBrickInfoList() {
        let randomNum = this.curRandomNum;
        const curBrickCenterPos = defaultBrickCenterPos.slice();
        for (let i = 0; i <= 10000; i++) {
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
}