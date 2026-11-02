import { useCurrentUser } from '@/auth/session';

export default function Home() {
  const user = useCurrentUser();

  return (
    <section className="bg-surface">
      <div className="page-container py-8 md:py-12">
        <h1 className="text-display">Tìm trọ quanh Hòa Lạc</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {user ? `Xin chào ${user.fullName}! ` : ''}
          Giá thuê luôn đi kèm chi phí cố định ước tính, số phòng còn trống và ngày cập nhật.
        </p>
      </div>
    </section>
  );
}
