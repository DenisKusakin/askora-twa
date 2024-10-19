import { Cell } from '@ton/core';

export const ACCOUNT_CODE=Cell.fromBase64("te6cckECJAEABDQAART/APSkE/S88sgLAQIBYgIZAgLMAxMCASAEDQIBIAUKAfdAHQ0wMBcbCSXwTg+kAwAdMf7UTQ+kD6QCDXScIAmdTU0x/TH/oAMJYwbW1tbW3ighA5ItdwI26wUpC6jjxfBTMz+gDU1DBwUwUF8AIiggnJw4C8jhgCggnJw4ChggiYloChAYIImJaAobYI8AaaW4IJycOAufLRleLgKIBgJ6ghCqrMBbuo4XMDQ2NzdTQccF8uGTAvoAMBBGFUMw8ALgKIIQKLHkerrjAjk5OQWCELbVu8K64wJfCPLBlAcJAf44i/Y3JlYXRlIHF1ZXN0aW9uj+FDBThccF8tGTU6mhggnJw4C5mjkJggnJw4ChCAmROuKCCmJaAFNwoFKgu5PywZXeBtQwUZahVCmAVGZgVGxw8AUIpF0QRlEwQxNQyfAC+CpEMPAHIPAJghC21bvCyMsfE8wVzFADzxbJd4AYCABeyMsFUATPFlj6AhLLaxLMzMlx+wCNBVjcmVhdGUgcXVlc3Rpb24gYWZ0ZXKD+FDAAyo0EXF1ZXN0aW9uIGRlcGxveWVkg/hQwJ26ScDjeJm6ScDfeJW6ScDbeIG6XMDMB1NRDQ94D+kAw+CglUoPwCwWkUAVGFgTwAo0F3F1ZXN0aW9uIGRlcGxveWVkIGFmdGVyg/hQwAgEgCwwALzIUAbPFlAGzxYTzMzLHxLLHwH6AsntVIAArMhQA88Wyx/JcCDIywET9AD0AMsAyYAIBIA4QAgEgFw8Adz4KFrwAyDwBMhQBc8WUAPPFsmCEDcNSwLIyx8WzFAEzxYUzMl3gBjIywUjzxZQBPoCE8trE8zMyXH7AIAIBIBESADkghDoJolZcIAQyMsFUATPFlj6AhLLassfyXH7AIAAtMhQA88WAc8WyXAgyMsBE/QA9ADLAMmACAUgUFgIBIBUXAC8yFjPFssfUhDMyXAgyMsBE/QA9ADLAMmACASAXGAAbPkAcHTIywLKB8v/ydCAATxVIPAIIPAKyFADzxbJd4AYyMsFUATPFoIImJaA+gITy2vMzMlx+wCACASAaGwBXvjTfaiaH0gfSAQa6ThAEzqammP6Y/9ABhLGDa2tra28QgbL4N8FCx4BHgFQCASAcIwIBIB0gAgEgHh8ASbOLO1E0PpA+kAg10nCAJnU1NMf0x/6ADCWMG1tbW1t4hAmXwaAAR7EXO1E0PpA+kAg10nCAJnU1NMf0x/6ADCWMG1tbW1t4hZfBoAIBICEiAEWyaPtRND6QPpAINdJwgCZ1NTTH9Mf+gAwljBtbW1tbeJsYYABhsKF7UTQ+kD6QCDXScIAmdTU0x/TH/oAMJYwbW1tbW3ibDPIUATPFlAD+gLLH8sfyYABXujA+1E0PpA+kAg10nCAJnU1NMf0x/6ADCWMG1tbW1t4hBGXwb4KFnwA/AEhpTzP7")

export const QUESTION_CODE=Cell.fromBase64("te6cckECHQEAAnoAART/APSkE/S88sgLAQIBYgIOAgLNAw0CASAECgIBIAUJA+cAdDTAwFxsJJfBOD6QDDwAWwhCtMfghA3DUsCBm4WsFIQuo4hEEZfBjQ0NAHU+kDUMND6QPpAMPgjcHDIyRB4EGdVAvAC4IIQ/ajG4CKzsFIQuuMCNIIQpcVmuSGzsFJAuuMCghBWFsVyO7MasBK64wJfCYAYHCAB8WzlTYMcF8uGTAdQwEFYQRRA0ECN/cFM6UEQL8AICggiYloChIHWAZKmEZqETghBHqNRD8AMBghC0GRfC8AQAZDAyU2DHBfLhk39/yMlTUxBrULwUQzDwAlEyoYIImJaAoROCEJQxCKbwA4IQ6CaJWfADAF4mgggJOoCg+CO+8tGTf3DIySQQihB5EGgHBhBFEEvwAgGCCJiWgKGCEJQxCKbwAwBzO1E0PpA0x8g10nAAJowbW1tbW1wcG1t4PpA+kDUAdDU+kDU+kAF0h/SHzAG0h8wEFgQVxBWEEVEMIAIBIAsMAFEyFAGzxZQBM8WF8wSzBLKH8nIUAfPFhXLH1jPFgHPFhPMyh/KH8ntVIAAtHCAEMjLBVAEzxZY+gISy2rLH8lx+wCAAOdQD24QAhkZYKoAueLKAH9AQnltQllj+Wf5Lj9gEAgEgDxgCASAQFQIBIBESABG0kJ4AIgVL4VACASATFAANsXE8AFsoYAAPsNt8AEaXwqACAnYWFwAQq5zwARBaXwoAEKif8AEQel8KAgFmGRwCASAaGwARrRz4AIhFL4VAABGvuPgAiB0vhUAAU7ChfABNDQ4yFAFzxZQA88WyQTIzMzJBMjLHxLLABTLABPLH8nIzMzMyYNbtI3Q=")

export const QUESTION_REF_CODE=Cell.fromBase64("te6cckEBBAEALAABFP8A9KQT9LzyyAsBAgFiAgMAGtBsMfpAMMgBzxbJ7VQAEaHGB9qJofSAYdAopW8=")