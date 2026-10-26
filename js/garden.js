
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype = {
    rotate: function (theta) {
        var x = this.x;
        var y = this.y;
        this.x = Math.cos(theta) * x - Math.sin(theta) * y;
        this.y = Math.sin(theta) * x + Math.cos(theta) * y;
        return this;
    },
    mult: function (f) {
        this.x *= f;
        this.y *= f;
        return this;
    },
    clone: function () {
        return new Vector(this.x, this.y);
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    subtract: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },
    set: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
};

var peonyImage = new Image();
peonyImage.src = "images/peony.png";

function Bloom(p, r, c, pc, garden) {
    this.p = p;
    this.r = r;
    this.c = c;
    this.pc = pc;
    this.garden = garden;

    this.size = Garden.random(42, 66);
    this.scale = 0.15;
    this.rotation = Garden.random(0, Math.PI * 2);
    this.growth = Garden.random(0.025, 0.055);

    this.garden.addBloom(this);
}

Bloom.prototype = {
    draw: function () {
        var ctx = this.garden.ctx;

        if (!peonyImage.complete || !peonyImage.naturalWidth) {
            return;
        }

        this.scale = Math.min(1, this.scale + this.growth);

        var size = this.size * this.scale;

        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = 1;

        ctx.drawImage(
            peonyImage,
            -size / 2,
            -size / 2,
            size,
            size
        );

        ctx.restore();
    }
};

function Garden(ctx, element) {
    this.blooms = [];
    this.element = element;
    this.ctx = ctx;
}

Garden.prototype = {
    render: function () {
        for (var i = 0; i < this.blooms.length; i++) {
            this.blooms[i].draw();
        }
    },

    addBloom: function (bloom) {
        this.blooms.push(bloom);
    },

    removeBloom: function (bloom) {
        var index = this.blooms.indexOf(bloom);

        if (index !== -1) {
            this.blooms.splice(index, 1);
        }
    },

    createRandomBloom: function (x, y) {
        this.createBloom(
            x,
            y,
            Garden.randomInt(18, 30),
            "#f5a0bd",
            Garden.randomInt(24, 36)
        );
    },

    createBloom: function (x, y, r, c, pc) {
        new Bloom(new Vector(x, y), r, c, pc, this);
    },

    clear: function () {
        this.blooms = [];
        this.ctx.clearRect(
            0,
            0,
            this.element.width,
            this.element.height
        );
    }
};

Garden.options = {
    petalCount: {
        min: 24,
        max: 36
    },
    petalStretch: {
        min: 0.5,
        max: 2.2
    },
    growFactor: {
        min: 0.2,
        max: 0.7
    },
    bloomRadius: {
        min: 18,
        max: 30
    },
    density: 10,
    growSpeed: 1000 / 60,
    color: {
        rmin: 240,
        rmax: 255,
        gmin: 125,
        gmax: 175,
        bmin: 155,
        bmax: 205,
        opacity: 0.8
    },
    tanAngle: 60
};

Garden.random = function (min, max) {
    return Math.random() * (max - min) + min;
};

Garden.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Garden.circle = 2 * Math.PI;

Garden.degrad = function (angle) {
    return Garden.circle / 360 * angle;
};

Garden.raddeg = function (angle) {
    return angle / Garden.circle * 360;
};

Garden.rgba = function (r, g, b, a) {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};

Garden.randomrgba = function (rmin, rmax, gmin, gmax, bmin, bmax, a) {
    return Garden.rgba(
        Garden.random(rmin, rmax),
        Garden.random(gmin, gmax),
        Garden.random(bmin, bmax),
        a
    );
};
