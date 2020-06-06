class Fountain {
    constructor(obstacleList, maxTatgetSize) {
        this.obstacleList = obstacleList;
        this.maxTatgetSize = maxTatgetSize || 20;
        this._createObstacleBuffer(obstacleList);
        this.max2R = Math.ceil(Math.min(this.obstacleHeight, this.obstacleWidth) / 2) + this.maxTatgetSize;
        this._createDistanceBuffer();
    }

    _createObstacleBuffer(obstacleList) {
        this.minX = Number.MAX_VALUE;
        this.minY = Number.MAX_VALUE;
        this.maxX = 0;
        this.maxY = 0;
        for (let rect of obstacleList) {
            this.minX = Math.min(this.minX, rect.x);
            this.minY = Math.min(this.minY, rect.y);
            this.maxX = Math.max(this.maxX, rect.x + rect.width);
            this.maxY = Math.max(this.maxY, rect.y + rect.height);
        }
        this.obstacleHeight = this.maxY - this.minY;
        this.obstacleWidth = this.maxX - this.minX;
        this.CoordMinX = this.minX - this.maxTatgetSize;
        this.CoordMinY = this.minY - this.maxTatgetSize;
        this.obstacleBuffer = [];
    }

    _createDistanceBuffer() {
        this.distanceBuffer = [];
        let d;
        for (let i = 0; i < this.max2R; i++) {
            for (let j = 0; j <= i; j++) {
                d = Math.round(Math.sqrt(i * i + j * j));
                if (!this.distanceBuffer[d]) {
                    this.distanceBuffer[d] = [];
                }
                this.distanceBuffer[d].push([i, j]);
            }
        }
    }

    place(point, size) {
        // coord change
        this.curWidth = size.width;
        this.curHight = size.height;
        let result = this._placePoint({
            x: point.x - this.CoordMinX,
            y: point.y - this.CoordMinY
        }, size);
        if (result) {
            return [result[0] + this.CoordMinX, result[1] + this.CoordMinY];
        }
        return false;
    }

    _placePoint(point, size) {
        this._setObstacleBufferBasedOnTargetSize(size);
        let {width, height} = size;
        let {x, y} = point;
        let maxR = Math.min(this.obstacleHeight + height, this.obstacleWidth + width) / 2;
        let cur;
        for (let i = 0; i < maxR; i++) {
            for (let item of this.distanceBuffer[i]) {
                cur = [
                    [x + item[0], y + item[1]],
                    [x - item[0], y + item[1]],
                    [x + item[0], y - item[1]],
                    [x - item[0], y - item[1]],
                    [x + item[1], y + item[0]],
                    [x - item[1], y + item[0]],
                    [x + item[1], y - item[0]],
                    [x - item[1], y - item[0]]
                ];
                for (let c of cur) {
                    if (this._placeAble(c)) {
                        return c;
                    }
                }
            }
        }
        // err
        return false;
    }

    addObstacle({width, height, x, y}) {
        for (let i = rect.x - width; i < rect.x + rect.width; i++) {
            for (let j = rect.y - height; j < rect.y + rect.height; j++) {
                if (!this.obstacleBuffer[i - this.CoordMinX]) {
                    this.obstacleBuffer[i - this.CoordMinX] = [];
                }
                this.obstacleBuffer[i - this.CoordMinX][j - this.CoordMinY] = 1;
            }
        }
    }

    get obstacleBufferHeight() {
        return this.obstacleHeight + this.maxTatgetSize;
    }

    get obstacleBufferWidth() {
        return this.obstacleWidth + this.maxTatgetSize;
    }

    _setObstacleBufferBasedOnTargetSize({width, height}) {
        for (let rect of this.obstacleList) {
            for (let i = rect.x - width; i < rect.x + rect.width; i++) {
                for (let j = rect.y - height; j < rect.y + rect.height; j++) {
                    if (!this.obstacleBuffer[i - this.CoordMinX]) {
                        this.obstacleBuffer[i - this.CoordMinX] = [];
                    }
                    this.obstacleBuffer[i - this.CoordMinX][j - this.CoordMinY] = 1;
                }
            }
        }
    }

    _placeAble([x, y]) {
        // todo edge test?
        if (!this.obstacleBuffer[x]) {
            return true;
        }
        if (this.obstacleBuffer[x][y] === 1) {
            return false;
        }
        return true;
    }
}

window.Fountain = Fountain;