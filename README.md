# Nexus Apollo-13 (autonomous)

Nexus control plane under [`nexus/`](./nexus). Runs **without the operator PC and without Cursor Agent**.

```bash
cd nexus
npm run apollo13          # start autonomous control plane on :8787
npm run apollo13:verify   # live health + mercadeoia task + failover check
```

See [`nexus/README.md`](./nexus/README.md).
