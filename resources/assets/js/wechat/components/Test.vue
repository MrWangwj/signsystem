<template>
    <div>
        <group title="禁用内置验证及显示成功或者错误样式">
            <x-input title="禁用验证" placeholder="I'm placeholder" novalidate :icon-type="iconType" :show-clear="false" @on-blur="onBlur" placeholder-align="right"></x-input>
        </group>
    </div>
</template>
<script>
    import { XInput, Group } from 'vux'

    export default {
        components: {
            XInput,
            Group
        },
        data () {
            return {
                password: '123465',
                password2: '',
                enterText: '',
                valid1: false,
                valid2: false,
                iconType: '',
                be2333: function (value) {
                    return {
                        valid: value === '2333',
                        msg: 'Must be 2333'
                    }
                },
                style: '',
                disabledValue: 'hello',
                debounceValue: '',
                maxValue: '',
                maskValue: '13545678910',
                maskValue2: ''
            }
        },
        methods: {

        }
    }
</script>