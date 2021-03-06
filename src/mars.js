import preprocess from './redcode/preproc.js'
import lexer from './redcode/lexer.js'
import parse from './redcode/parser.js'
import compile from './redcode/compiler.js'
import exec from './redcode/vm.js'
import { WRITE, EXEC, mod } from './util.js'

const blank_cell = {
    id: 0,
    status: 0,
    op: 'DAT.F',
    ma: '$',
    mb: '$',
    a: 0,
    b: 0,
}

const state = function(coreSize) {
    const s = Object.create(state_original)
    s.core = new Array(coreSize)
    for (let i = 0; i < coreSize; i++) {
        s.core[i] = { ...blank_cell }
    }
    s.dirty = new Set()
    s.queue = []
    s.index = 0
    s.cycles = 0
    return s
}

const state_original = {
    clear() {
        this.core = new Array(this.core.length)
        for (let i = 0; i < this.core.length; i++) {
            this.core[i] = { ...blank_cell }
        }
        this.dirty = new Set()
        this.queue = []
        this.index = 0
        this.cycles = 0
    },

    shuffle() {
        let q = this.queue, n = q.length, i
        while (n !== 0) {
            i = Math.random() * n | 0
            n -= 1
            ;[ q[i], q[n] ] = [ q[n], q[i] ]
        }
    },
}

export default function MARS(opts = {}) {
    const defaults = {
        coreSize: 8000,
        minDistance: 100,
        instructionLimit: 100,
        threadLimit: 8000,
    }
    const j = Object.create(MARS_original)
    j.opts = { ...defaults, ...opts }
    j.state = state(j.opts.coreSize)
    j.warriors = []
    j.warriors.lookup = {}
    return j
}

const MARS_original = {
    clear() {
        this.state.clear()
        this.warriors = []
        this.warriors.lookup = {}
    },

    load(name, src) {
        if (src === undefined) {
            [name, src] = [src, name]
        }

        const [srcname, ...input] = preprocess(src)
        const ast = parse(lexer(...input))
        const [org, code] = compile(...ast)
        if (code.length > this.opts.instructionLimit) {
            throw new Error('Total instructions cannot exceed ' + this.opts.instructionLimit)
        }

        name = name || srcname || 'Nameless'
        let prefix = name, suffix = 2
        while (this.warriors.lookup[name] !== undefined) {
            name = prefix + suffix
            suffix += 1
        }

        const warrior = { name, org, code }
        const total = this.warriors.push(warrior)
        warrior.id = total-1
        warrior.stage = this.stage.bind(this, warrior.id)
        this.warriors.lookup[name] = warrior
        return warrior
    },

    stage(warrior, start) {
        warrior = typeof warrior === 'string'
                ? this.warriors.lookup[warrior]
                : this.warriors[warrior]
        if (warrior === undefined) {
            throw new Error(`Failed to stage unknown warrior`)
        }

        if (start === undefined) {
            let iter = 0, gap = 0
            while (gap < this.opts.minDistance) {
                iter += 1
                if (iter > 100) {
                    throw new Error(`Unable to stage warrior "${warrior.name}"`)
                }
                start = Math.random() * this.opts.coreSize | 0
                gap = Infinity
                this.state.queue.forEach(w => {
                    const d1 = mod(w.start - start, this.opts.coreSize)
                    const d2 = mod(start - w.start, this.opts.coreSize)
                    if (d1 < gap) gap = d1
                    if (d2 < gap) gap = d2
                })
            }
        }

        warrior.code.forEach((inst, i) => {
            const data = {
                id: warrior.id,
                status: WRITE,
                ...inst,
            }
            data.a = mod(data.a, this.opts.coreSize)
            data.b = mod(data.b, this.opts.coreSize)
            const loc = mod(start + i, this.opts.coreSize)
            this.state.core[loc] = data
            this.state.dirty.add(loc)
        })

        this.state.queue.push({
            id: warrior.id,
            start,
            tasks: [mod(start + warrior.org, this.opts.coreSize)],
        })
        return start
    },

    stageAll() {
        this.warriors.forEach(w => w.stage())
    },

    step() {
        exec(this.state, this.opts.threadLimit)
    },

    cycle() {
        const s = this.state, tl = this.opts.threadLimit
        if (s.queue.length < 2) {
            exec(s, tl)
        } else {
            const c = s.cycles
            while (s.queue.length > 1 && c === s.cycles) {
                exec(s, tl)
            }
        }
        return s.cycles
    },
}

MARS.WRITE = WRITE
MARS.EXEC = EXEC
