const scaleFactor = 10;

const clock_gettime = Module.findExportByName(null, "clock_gettime");

const clock_gettime_func = new NativeFunction(
    clock_gettime,
    'int', ['int', 'pointer']
);

Interceptor.attach(clock_gettime, {
    onEnter: function (args) {

        this.clock_id = args[0].toInt32();
        this.tp = args[1];
    },
    onLeave: function (retval) {
        const real_tp = Memory.alloc(16);
        const real_retval = clock_gettime_func(this.clock_id, real_tp);

        const tv_sec = real_tp.readU64();
        const tv_nsec = real_tp.add(8).readU64();

        const scaled_tv_sec = tv_sec * scaleFactor;
        const scaled_tv_nsec = tv_nsec * scaleFactor;

        const overflow = Math.floor(scaled_tv_nsec / 1e9);
        const final_tv_sec = scaled_tv_sec + overflow;
        const final_tv_nsec = scaled_tv_nsec % 1e9;

        this.tp.writeU64(final_tv_sec);
        this.tp.add(8).writeU64(final_tv_nsec);
        retval.replace(real_retval);
    }
});

// frida -p $(pgrep Slg_Map_Frame-mobile) -l z.js